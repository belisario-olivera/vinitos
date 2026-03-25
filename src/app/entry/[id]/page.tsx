'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Sparkles,
  MapPin,
  Grape,
  Calendar,
  DollarSign,
  MapPinned,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WineRating } from '@/components/wine/WineRating';
import { PrivacyBadge } from '@/components/wine/PrivacyBadge';
import { SimilarWines } from '@/components/wine/SimilarWines';
import { DeleteConfirmDialog } from '@/components/wine/DeleteConfirmDialog';
import { ShareDialog } from '@/components/wine/ShareDialog';
import { useWineEntry } from '@/hooks/useWineEntry';
import { useDeleteWineEntry } from '@/hooks/useDeleteWineEntry';

const EntryDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: entry, isLoading, error } = useWineEntry(params.id);
  const deleteEntry = useDeleteWineEntry();

  const [showSimilar, setShowSimilar] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleDelete = () => {
    deleteEntry.mutate(params.id, {
      onSuccess: () => {
        toast.success('Entry deleted');
        router.push('/journal');
      },
      onError: (err) => {
        toast.error('Failed to delete', { description: err.message });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button render={<Link href="/journal" />} variant="ghost" size="sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Journal
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShare(true)}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
          <Button
            render={<Link href={`/entry/${entry.id}/edit`} />}
            variant="outline"
            size="sm"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDelete(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{entry.title}</h1>
              <p className="text-muted-foreground">
                {entry.producer}
                {entry.vintage && ` · ${entry.vintage}`}
              </p>
            </div>
            <PrivacyBadge privacy={entry.privacy} />
          </div>
          <WineRating value={entry.rating} readonly size="lg" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {entry.region && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Region:</span>
                <span className="text-muted-foreground">{entry.region}</span>
              </div>
            )}
            {entry.grapes.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Grape className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Grapes:</span>
                <span className="text-muted-foreground">
                  {entry.grapes.join(', ')}
                </span>
              </div>
            )}
            {entry.price !== null && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Price:</span>
                <span className="text-muted-foreground">${entry.price}</span>
              </div>
            )}
            {entry.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPinned className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tasted at:</span>
                <span className="text-muted-foreground">{entry.location}</span>
              </div>
            )}
            {entry.purchaseDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Purchased:</span>
                <span className="text-muted-foreground">
                  {new Date(entry.purchaseDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {entry.notes && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">Tasting Notes</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {entry.notes}
                </p>
              </div>
            </>
          )}

          {entry.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Created{' '}
              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {entry.updatedAt !== entry.createdAt && (
              <span>
                Updated{' '}
                {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {!showSimilar && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSimilar(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Find Similar Wines
          </Button>
        )}
        <div className="mt-4">
          <SimilarWines entryId={entry.id} enabled={showSimilar} />
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        isDeleting={deleteEntry.isPending}
        title={entry.title}
      />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        entryId={entry.id}
        title={entry.title}
      />
    </div>
  );
};

export default EntryDetailPage;
