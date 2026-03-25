import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, handleAuthError } from '@/lib/auth';
import { updateWineEntrySchema } from '@/lib/validation/schemas';
import * as wineEntryService from '@/services/wineEntryService';

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

    return NextResponse.json({ ok: true, data: entry });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { userId } = await verifyAuth();
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

    const updated = await wineEntryService.updateEntry(userId, id, parsed.data);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const DELETE = async (_request: NextRequest, { params }: RouteParams) => {
  try {
    const { userId } = await verifyAuth();
    const { id } = await params;

    const deleted = await wineEntryService.deleteEntry(userId, id);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: null });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
