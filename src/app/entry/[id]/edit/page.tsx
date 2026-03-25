'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WineForm } from '@/components/wine/WineForm';
import { useWineEntry } from '@/hooks/useWineEntry';
import { useUpdateWineEntry } from '@/hooks/useUpdateWineEntry';
import type { CreateWineEntryInput } from '@/lib/validation/schemas';

const EditEntryPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: entry, isLoading, error } = useWineEntry(params.id);
  const updateEntry = useUpdateWineEntry();

  const handleSubmit = (data: CreateWineEntryInput) => {
    updateEntry.mutate(
      { id: params.id, dto: data },
      {
        onSuccess: () => {
          toast.success('Entry updated!', {
            description: 'Your changes have been saved.',
          });
          router.push(`/entry/${params.id}`);
        },
        onError: (err) => {
          toast.error('Failed to update', { description: err.message });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Entry not found</h2>
        <p className="mt-2 text-muted-foreground">
          This wine entry doesn&apos;t exist or has been deleted.
        </p>
        <Button render={<Link href="/journal" />} className="mt-4">
          Back to Journal
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Button
          render={<Link href={`/entry/${params.id}`} />}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Entry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Entry</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your tasting notes for &quot;{entry.title}&quot;
          </p>
        </CardHeader>
        <CardContent>
          <WineForm
            defaultValues={entry}
            onSubmit={handleSubmit}
            isSubmitting={updateEntry.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEntryPage;
