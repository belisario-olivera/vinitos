import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export type AuthResult = {
  userId: string;
};

export const verifyAuth = async (): Promise<AuthResult> => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError('Unauthorized');
  }

  return { userId: user.id };
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const handleAuthError = (error: unknown) => {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
};
