import { NextRequest, NextResponse } from 'next/server';
import { searchOpportunities } from '@/lib/services/opportunities/engine/search';
import { buildAIContext } from '@/lib/services/ai/context/builder';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Opportunities API Router: Received search request.');

    const body = await request.json();
    const { query, opportunityType, country, fullyFunded, userId, bypassCache } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    let context = null;
    if (userId) {
      try {
        const fullContext = await buildAIContext(userId);
        context = fullContext.rawContext;
      } catch (err) {
        logger.warn('Opportunities API Router: Failed to construct user AI context.', { error: String(err) });
      }
    }

    const result = await searchOpportunities(
      { query, opportunityType, country, fullyFunded },
      context,
      bypassCache
    );

    return NextResponse.json({
      success: true,
      opportunities: result.opportunities,
      cacheHit: result.cacheHit
    });

  } catch (error) {
    logger.error('Opportunities API Router: Unexpected handler exception.', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
