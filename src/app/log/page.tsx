'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WineForm } from '@/components/wine/WineForm';
import { useCreateWineEntry } from '@/hooks/useCreateWineEntry';
import type { CreateWineEntryInput } from '@/lib/validation/schemas';

const LogPage = () => {
  const router = useRouter();
  const createEntry = useCreateWineEntry();

  const handleSubmit = (data: CreateWineEntryInput) => {
    createEntry.mutate(data, {
      onSuccess: (entry) => {
        toast.success('Bottle logged!', {
          description: `"${entry.title}" has been added to your journal.`,
        });
        router.push(`/entry/${entry.id}`);
      },
      onError: (error) => {
        toast.error('Failed to log bottle', {
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Button render={<Link href="/journal" />} variant="ghost" size="sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Journal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Log a Bottle</CardTitle>
          <p className="text-sm text-muted-foreground">
            Record your tasting notes and rate your wine experience.
          </p>
        </CardHeader>
        <CardContent>
          <WineForm
            onSubmit={handleSubmit}
            isSubmitting={createEntry.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LogPage;
