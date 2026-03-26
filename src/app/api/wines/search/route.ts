import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, handleAuthError } from '@/lib/auth';
import { wineSearchSchema } from '@/lib/validation/schemas';
import * as wineCatalogService from '@/services/wineCatalogService';

export const GET = async (request: NextRequest) => {
  try {
    await verifyAuth();

    const { searchParams } = new URL(request.url);
    const parsed = wineSearchSchema.safeParse({ q: searchParams.get('q') });

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid search query' },
        { status: 400 }
      );
    }

    const results = await wineCatalogService.searchWines(parsed.data.q);
    return NextResponse.json({ ok: true, data: results });
  } catch (error) {
    return (
      handleAuthError(error) ??
      NextResponse.json(
        { ok: false, error: 'Internal server error' },
        { status: 500 }
      )
    );
  }
};
