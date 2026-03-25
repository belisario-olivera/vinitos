import { NextResponse } from 'next/server';
import { verifyAuth, handleAuthError } from '@/lib/auth';
import * as wineEntryService from '@/services/wineEntryService';

export const GET = async () => {
  try {
    const { userId } = await verifyAuth();
    const stats = await wineEntryService.getStats(userId);
    return NextResponse.json({ ok: true, data: stats });
  } catch (error) {
    return handleAuthError(error) ?? NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
