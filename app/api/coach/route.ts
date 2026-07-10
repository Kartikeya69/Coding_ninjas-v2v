import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/services/ai/engine';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('AI Coach API Router: Received chat request.');

    const body = await request.json();
    const { userId, message } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters: userId and message are required' },
        { status: 400 }
      );
    }

    const response = await aiEngine.execute({
      feature: 'ai_coach',
      userId,
      input: message,
      options: {
        bypassCache: true
      }
    });

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || 'AI Coach conversation run failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      metrics: response.metrics
    });

  } catch (error) {
    logger.error('AI Coach API Router: Exception running handler.', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
