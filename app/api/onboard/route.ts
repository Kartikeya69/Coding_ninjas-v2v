import { NextRequest, NextResponse } from 'next/server';
import { OnboardingPayloadSchema, AIProfile, UserProfile, OnboardingPayload } from '../../../types/user';
import { logger } from '../../../lib/logger';
import { aiConfig } from '../../../lib/services/ai/config';
import { createHash } from 'crypto';

const onboardingInFlight = new Map<string, Promise<AIProfile>>();

function createRequestHash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

// Standard fallback profile in case the API key is missing or parsing fails
const getFallbackProfile = (name: string, stage: string, targetRole: string): AIProfile => ({
  persona: `Motivated ${stage === 'professional' ? 'Industry Pioneer' : 'Emerging Talent'} in ${targetRole}`,
  learningStyle: 'Practical, project-centric learning',
  growthPriorities: ['Build foundational projects', 'Expand technical core index', 'Match with industry mentors'],
  strengths: ['Growth mindset', 'Ambition', 'Goal clarity'],
  gaps: ['Hands-on engineering projects', 'Advanced system architectural patterns'],
  suggestedPaths: [targetRole],
  suggestedSkills: ['React', 'TypeScript', 'Next.js', 'System Design'],
  learningGoal: 'Deploy one core portfolio application',
  firstMilestone: 'Complete interactive foundations checklist in your dashboard workspace',
  welcomeMessage: `Welcome to your Career Operating System, ${name || 'Explorer'}! We have structured a roadmap to guide you towards becoming a leading ${targetRole}.`,
  version: 1,
  model: 'gemini-1.5-flash (Fallback)',
  generatedAt: new Date().toISOString(),
});

export async function POST(request: NextRequest) {
  try {
    logger.info('Onboarding API endpoint triggered.');
    
    // Parse request body
    const body = await request.json();
    
    // 1. Zod Validation
    const validationResult = OnboardingPayloadSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn('Onboarding payload validation failed', { errors: validationResult.error.format() });
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid onboarding payload structure', 
        errors: validationResult.error.format() 
      }, { status: 400 });
    }

    const payload = validationResult.data;
    const { uid, email, displayName, photoURL, stage } = payload;
    
    // Extract target role / subjects for prompting
    const targetRole = payload.career?.currentRole || payload.education?.major || 'Software Developer';
    const userName = payload.displayName || 'Pioneer';

    const promptInput = JSON.stringify({
      stage,
      education: payload.education || null,
      career: payload.career || null,
      preferences: payload.preferences || null,
      availability: payload.availability || null,
    });
    const cacheHash = createRequestHash(`${uid}:career_guidance:onboarding-v1:${promptInput}`);
    const { getCachedResponse, setCachedResponse } = await import('../../../lib/services/ai/cache');
    const cachedProfile = await getCachedResponse(uid, cacheHash);
    if (cachedProfile) {
      const profile = withProfileMetadata(cachedProfile as Partial<AIProfile>, 'cache');
      await saveUserProfile(uid, email, displayName, photoURL, stage, payload, profile);
      return NextResponse.json({ success: true, profile, cached: true });
    }

    // 2. Check API Key (supports comma-separated rotation pool)
    const apiKeysRaw = process.env.GEMINI_API_KEY || '';
    const apiKeys = apiKeysRaw.split(',').map(k => k.trim()).filter(Boolean);
    if (apiKeys.length === 0) {
      logger.warn('GEMINI_API_KEY is not defined in env variables. Generating fallback profile...');
      const fallback = getFallbackProfile(userName, stage, targetRole);
      await saveUserProfile(uid, email, displayName, photoURL, stage, payload, fallback);
      return NextResponse.json({ success: true, profile: fallback });
    }
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    // 3. Craft Gemini prompt
    const systemPrompt = `You are Lumina, a warm, encouraging, professional female career mentor. Your goal is to analyze onboarding data and output a structured JSON profile for the user.
You MUST output raw JSON matching the JSON schema below. Do not include markdown code block markers.

Onboarding Data:
- User Name: ${userName}
- Career Stage: ${stage}
- Education details: ${JSON.stringify(payload.education || {})}
- Career experience: ${JSON.stringify(payload.career || {})}
- Available weekly study hours: ${payload.availability?.weeklyHours || 10} hours

JSON Output Schema:
{
  "persona": "String describing their career persona (e.g. 'Emerging Frontend Craftsman')",
  "learningStyle": "String describing their learning style (e.g. 'Visual, project-based')",
  "growthPriorities": ["Array of 3 core priorities"],
  "strengths": ["Array of 3 strengths"],
  "gaps": ["Array of 2-3 skill/experience gaps"],
  "suggestedPaths": ["Array of 2 suggested roles/career paths"],
  "suggestedSkills": ["Array of 4-5 recommended technical skills to learn"],
  "learningGoal": "String defining a realistic weekly/monthly goal",
  "firstMilestone": "String defining their very first actionable milestone",
  "welcomeMessage": "A warm, motivational message addressing them by name"
}`;

    const generateProfile = async (): Promise<AIProfile> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), aiConfig.timeoutMs);
      try {
        logger.info('Invoking Gemini API for onboarding profile.');
        const apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.defaultModel}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2,
                topP: 0.9,
                maxOutputTokens: 900,
              },
            }),
            signal: controller.signal,
          }
        );

        if (!apiResponse.ok) {
          throw new Error(`Gemini API returned status code ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textResponse) {
          throw new Error('Empty response returned by Gemini.');
        }

        // Clean & parse JSON safely
        const parsedJson = JSON.parse(textResponse.trim());
        const profile = {
          ...parsedJson,
          version: 1,
          model: aiConfig.defaultModel,
          generatedAt: new Date().toISOString(),
        };
        await setCachedResponse(uid, cacheHash, profile, aiConfig.cacheTTLMs);
        return profile;
      } catch (err) {
        logger.error('Error invoking/parsing Gemini API in api/onboard', err);
        return getFallbackProfile(userName, stage, targetRole);
      } finally {
        clearTimeout(timeout);
      }
    };

    const inFlightKey = `${uid}:${cacheHash}`;
    const existingRequest = onboardingInFlight.get(inFlightKey);
    const finalProfile = existingRequest || generateProfile();
    if (!existingRequest) {
      onboardingInFlight.set(inFlightKey, finalProfile);
    }

    // 4. Server-Side write to Firestore
    let resolvedProfile: AIProfile;
    try {
      resolvedProfile = await finalProfile;
    } finally {
      if (!existingRequest) {
        onboardingInFlight.delete(inFlightKey);
      }
    }
    await saveUserProfile(uid, email, displayName, photoURL, stage, payload, resolvedProfile);
    
    logger.info(`Successfully generated and stored user profile in Firestore for UID: ${uid}`);
    return NextResponse.json({ success: true, profile: resolvedProfile });

  } catch (error) {
    logger.error('Unhandled server exception in POST api/onboard', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

function withProfileMetadata(profile: Partial<AIProfile>, model: string): AIProfile {
  return {
    persona: profile.persona || 'Emerging Engineering Talent',
    learningStyle: profile.learningStyle || 'Practical project-based study',
    growthPriorities: profile.growthPriorities || ['Build core skills', 'Complete portfolio work', 'Track weekly goals'],
    strengths: profile.strengths || ['Growth mindset', 'Ambition', 'Consistency'],
    gaps: profile.gaps || ['Portfolio depth', 'Interview practice'],
    suggestedPaths: profile.suggestedPaths || ['Software Developer'],
    suggestedSkills: profile.suggestedSkills || ['React', 'TypeScript', 'Next.js'],
    learningGoal: profile.learningGoal || 'Complete one focused learning sprint',
    firstMilestone: profile.firstMilestone || 'Review your dashboard setup checklist',
    welcomeMessage: profile.welcomeMessage || 'Welcome to your Lumina Career Operating System.',
    version: profile.version || 1,
    model: profile.model || model,
    generatedAt: profile.generatedAt || new Date().toISOString(),
  };
}

/**
 * Saves user details directly to Cloud Firestore
 */
async function saveUserProfile(
  uid: string, 
  email: string | null, 
  displayName: string | null, 
  photoURL: string | null, 
  stage: 'school' | 'college' | 'professional',
  payload: OnboardingPayload, 
  aiProfile: AIProfile
) {
  const now = new Date().toISOString();
  
  const userProfile: UserProfile = {
    uid,
    email,
    displayName,
    photoURL,
    onboarded: true,
    stage,
    education: payload.education,
    career: payload.career,
    preferences: payload.preferences,
    socials: payload.socials,
    availability: payload.availability,
    aiProfile,
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
  };

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await import('../../../firebase/firestore');
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userProfile, { merge: true });
  } catch (error) {
    logger.error('Failed to save onboarding profile to Firestore. Continuing with local app flow.', { error: String(error) });
  }
}
