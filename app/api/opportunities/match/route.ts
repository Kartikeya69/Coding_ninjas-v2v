import { NextRequest, NextResponse } from 'next/server';
import { runOpportunityEligibility } from '@/lib/services/opportunities/engine/eligibility';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Opportunities Match API Router: Triggering matching analysis.');

    const body = await request.json();
    const { userId, opportunity, resumeData } = body;

    if (!userId || !opportunity) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: userId or opportunity' },
        { status: 400 }
      );
    }

    const result = await runOpportunityEligibility(userId, opportunity, resumeData || {});

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'AI Opportunity Match execution failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      match: result.data,
      metrics: result.metrics
    });

  } catch (error) {
    logger.error('Opportunities Match API Router: Unexpected exception.', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
