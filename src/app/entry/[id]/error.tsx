'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EntryError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto w-fit rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">
        {error.message || 'Failed to load this wine entry.'}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button render={<Link href="/journal" />} variant="outline">
          Back to Journal
        </Button>
      </div>
    </div>
  );
};

export default EntryError;
