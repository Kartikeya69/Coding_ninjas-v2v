import { NextRequest, NextResponse } from 'next/server';
import { searchOpportunities } from '@/lib/services/jobs/engine/search';
import { buildAIContext } from '@/lib/services/ai/context/builder';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Jobs API Router: Received search request.');

    const body = await request.json();
    const { query, location, remoteOnly, userId, bypassCache } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Load user AI context if authenticated
    let context = null;
    if (userId) {
      try {
        const fullContext = await buildAIContext(userId);
        context = fullContext.rawContext;
      } catch (err) {
        logger.warn('Jobs API Router: Failed to construct user AI context. Ranking with default settings.', { error: String(err) });
      }
    }

    const result = await searchOpportunities(
      { query, location, remoteOnly },
      context,
      bypassCache
    );

    return NextResponse.json({
      success: true,
      jobs: result.jobs,
      cacheHit: result.cacheHit
    });

  } catch (error) {
    logger.error('Jobs API Router: Unexpected handler exception.', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
