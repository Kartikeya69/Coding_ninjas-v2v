import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/services/ai/engine';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Jobs Match API Router: Triggering opportunity fit evaluation.');

    const body = await request.json();
    const { userId, jobTitle, jobDescription, resumeData } = body;

    if (!userId || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: userId, jobTitle, or jobDescription' },
        { status: 400 }
      );
    }

    const promptInput = JSON.stringify({
      jobTitle,
      jobDescription,
      resumeData: resumeData || {}
    });

    const result = await aiEngine.execute({
      feature: 'career_match',
      userId,
      input: promptInput,
      options: {
        bypassCache: true // force matches calculations to get fresh metrics
      }
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'AI Matching execution failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      match: result.data,
      metrics: result.metrics
    });

  } catch (error) {
    logger.error('Jobs Match API Router: Unexpected handler exception.', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
