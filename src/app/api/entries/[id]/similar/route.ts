import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, handleAuthError } from '@/lib/auth';
import * as wineEntryService from '@/services/wineEntryService';
import * as recommendationService from '@/services/recommendationService';

type RouteParams = { params: Promise<{ id: string }> };

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  try {
    const { userId } = await verifyAuth();
    const { id } = await params;

    const entry = await wineEntryService.getEntryById(userId, id);
    if (!entry) {
      return NextResponse.json(
        { ok: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    const recommendations = await recommendationService.getSimilarWines(userId, id);
    return NextResponse.json({
      ok: true,
      data: { baseEntryId: id, recommendations },
    });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
