import { NextResponse } from 'next/server';
import { wineStore } from '@/lib/mock/mockStore';

export const GET = () => {
  const stats = wineStore.getStats();
  return NextResponse.json({ ok: true, data: stats });
};
