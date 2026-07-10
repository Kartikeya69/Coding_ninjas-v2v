import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/services/ai/engine';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('AI Engine Test API triggered.');

    const body = await request.json();
    const { feature, userId, input, bypassCache } = body;

    if (!feature || !userId || !input) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: feature, userId, and input are required.',
      }, { status: 400 });
    }

    // Call the central AI Engine
    const response = await aiEngine.execute({
      feature,
      userId,
      input,
      options: {
        bypassCache: !!bypassCache,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Server-side execute crash';
    logger.error('Error executing test AI query in API route:', error);
    return NextResponse.json({
      success: false,
      error: errMsg,
    }, { status: 500 });
  }
}
export default POST;
