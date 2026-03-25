import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, handleAuthError } from '@/lib/auth';
import { createWineEntrySchema, wineFiltersSchema } from '@/lib/validation/schemas';
import * as wineEntryService from '@/services/wineEntryService';
import type { WineFilters } from '@/types/wine';

export const GET = async (request: NextRequest) => {
  try {
    const { userId } = await verifyAuth();

    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = wineFiltersSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid filter parameters' },
        { status: 400 }
      );
    }

    const filters: WineFilters = {
      ...parsed.data,
      tags: parsed.data.tags ? parsed.data.tags.split(',') : undefined,
    };

    const entries = await wineEntryService.getAllEntries(userId, filters);
    return NextResponse.json({ ok: true, data: entries });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await verifyAuth();

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parsed = createWineEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 }
      );
    }

    const entry = await wineEntryService.createEntry(userId, parsed.data);
    return NextResponse.json({ ok: true, data: entry }, { status: 201 });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
