import { NextRequest, NextResponse } from 'next/server';
import { wineStore } from '@/lib/mock/mockStore';

type RouteParams = { params: Promise<{ id: string }> };

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const entry = wineStore.getById(id);

  if (!entry) {
    return NextResponse.json(
      { ok: false, error: 'Entry not found' },
      { status: 404 }
    );
  }

  const recommendations = wineStore.getSimilar(id);
  return NextResponse.json({
    ok: true,
    data: { baseEntryId: id, recommendations },
  });
};
