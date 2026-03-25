import { NextRequest, NextResponse } from 'next/server';
import { wineStore } from '@/lib/mock/mockStore';
import { updateWineEntrySchema } from '@/lib/validation/schemas';

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

  return NextResponse.json({ ok: true, data: entry });
};

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const parsed = updateWineEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues.map((i) => i.message).join(', ') },
      { status: 400 }
    );
  }

  const updated = wineStore.update(id, parsed.data);
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: 'Entry not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data: updated });
};

export const DELETE = async (_request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const deleted = wineStore.delete(id);

  if (!deleted) {
    return NextResponse.json(
      { ok: false, error: 'Entry not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data: null });
};
