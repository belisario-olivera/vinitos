import { NextRequest, NextResponse } from 'next/server';
import { wineStore } from '@/lib/mock/mockStore';
import { createWineEntrySchema, wineFiltersSchema } from '@/lib/validation/schemas';
import type { WineFilters } from '@/types/wine';

export const GET = (request: NextRequest) => {
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

  const entries = wineStore.getAll(filters);
  return NextResponse.json({ ok: true, data: entries });
};

export const POST = async (request: NextRequest) => {
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

  const entry = wineStore.create(parsed.data);
  return NextResponse.json({ ok: true, data: entry }, { status: 201 });
};
