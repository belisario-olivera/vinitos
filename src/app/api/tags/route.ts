import { NextResponse } from 'next/server';
import { wineStore } from '@/lib/mock/mockStore';

export const GET = () => {
  const tags = wineStore.getTags();
  return NextResponse.json({ ok: true, data: tags });
};
