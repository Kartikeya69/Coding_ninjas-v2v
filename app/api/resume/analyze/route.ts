import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/services/ai/engine';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Resume Studio: Triggering ATS Audit analysis.');
    
    const body = await request.json();
    const { userId, resumeData, jobDescription } = body;

    if (!userId || !resumeData) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: userId or resumeData' },
        { status: 400 }
      );
    }

    // Format resume profile structured details into standard clean text for LLM injection
    const promptInput = JSON.stringify({
      targetRole: resumeData.targetRole || 'Software Professional',
      profileSummary: resumeData.data?.summary || '',
      experience: resumeData.data?.experience || [],
      education: resumeData.data?.education || [],
      projects: resumeData.data?.projects || [],
      skills: resumeData.data?.skills || [],
      jobDescription: jobDescription || ''
    });

    const result = await aiEngine.execute({
      feature: 'resume_review',
      userId,
      input: promptInput,
      options: {
        bypassCache: true // force audit calculations to get fresh metrics
      }
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'AI execution failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: result.data,
      metrics: result.metrics
    });

  } catch (error) {
    logger.error('Resume API Router: Unexpected handler exception.', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
