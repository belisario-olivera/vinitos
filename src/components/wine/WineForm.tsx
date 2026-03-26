'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WineRating } from '@/components/wine/WineRating';
import { TagInput } from '@/components/wine/TagInput';
import { WineSearchInput } from '@/components/wine/WineSearchInput';
import {
  createWineEntrySchema,
  type CreateWineEntryInput,
  type CreateWineEntryFormValues,
} from '@/lib/validation/schemas';
import type { WineEntry } from '@/types/wine';
import type { WineSearchResult } from '@/types/wineCatalog';
import { WINE_REGIONS, WINE_GRAPES } from '@/lib/constants/wine';

type WineFormProps = {
  defaultValues?: WineEntry;
  onSubmit: (data: CreateWineEntryInput) => void;
  isSubmitting?: boolean;
};

export const WineForm = ({ defaultValues, onSubmit, isSubmitting }: WineFormProps) => {
  const form = useForm<CreateWineEntryFormValues>({
    resolver: zodResolver(createWineEntrySchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      vintage: defaultValues?.vintage ?? undefined,
      producer: defaultValues?.producer ?? '',
      region: defaultValues?.region ?? '',
      grapes: defaultValues?.grapes ?? [],
      purchaseDate: defaultValues?.purchaseDate ?? undefined,
      price: defaultValues?.price ?? undefined,
      location: defaultValues?.location ?? '',
      notes: defaultValues?.notes ?? '',
      rating: defaultValues?.rating ?? 3,
      tags: defaultValues?.tags ?? [],
      privacy: defaultValues?.privacy ?? 'private',
    },
  });

  const notes = form.watch('notes') ?? '';
  const grapes = form.watch('grapes') ?? [];
  const tags = form.watch('tags') ?? [];
  const rating = form.watch('rating') ?? 0;

  const handleGrapeToggle = (grape: string) => {
    const current = grapes;
    if (current.includes(grape)) {
      form.setValue('grapes', current.filter((g) => g !== grape));
    } else {
      form.setValue('grapes', [...current, grape]);
    }
  };

  const handleWineSelect = (wine: WineSearchResult) => {
    form.setValue('title', wine.name);
    if (wine.producer) form.setValue('producer', wine.producer);

    const matchingRegion = WINE_REGIONS.find(
      (r) =>
        r.toLowerCase().includes(wine.region.toLowerCase()) ||
        wine.region.toLowerCase().includes(r.toLowerCase())
    );
    if (matchingRegion) form.setValue('region', matchingRegion);

    const matchingGrapes = wine.grapes.filter((g) =>
      (WINE_GRAPES as readonly string[]).includes(g)
    );
    if (matchingGrapes.length > 0) form.setValue('grapes', matchingGrapes);
  };

  return (
    <form
      onSubmit={form.handleSubmit((data) => onSubmit(data as CreateWineEntryInput))}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Wine Name *</Label>
          <WineSearchInput
            id="title"
            value={form.watch('title') ?? ''}
            onChange={(v) => form.setValue('title', v)}
            onSelect={handleWineSelect}
            placeholder="e.g. Catena Zapata Malbec"
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="producer">Producer</Label>
            <Input
              id="producer"
              placeholder="e.g. Bodega Catena Zapata"
              {...form.register('producer')}
            />
          </div>
          <div>
            <Label htmlFor="vintage">Vintage</Label>
            <Input
              id="vintage"
              type="number"
              placeholder="e.g. 2020"
              {...form.register('vintage', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Region</Label>
            <Select
              value={form.watch('region') || ''}
              onValueChange={(v) => form.setValue('region', v ?? '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {WINE_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location Tasted</Label>
            <Input
              id="location"
              placeholder="e.g. Home, restaurant…"
              {...form.register('location')}
            />
          </div>
        </div>

        <div>
          <Label>Grapes</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {WINE_GRAPES.slice(0, 16).map((grape) => (
              <button
                key={grape}
                type="button"
                onClick={() => handleGrapeToggle(grape)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  grapes.includes(grape)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/40 hover:bg-accent'
                }`}
              >
                {grape}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="e.g. 25.00"
              {...form.register('price', { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...form.register('purchaseDate')}
            />
          </div>
        </div>

        <div>
          <Label>Rating *</Label>
          <div className="mt-1.5">
            <WineRating
              value={rating}
              onChange={(v) => form.setValue('rating', v)}
              size="lg"
            />
          </div>
          {form.formState.errors.rating && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Tasting Notes</Label>
          <Textarea
            id="notes"
            placeholder="Describe aromas, flavors, body, finish…"
            rows={5}
            className="resize-none"
            {...form.register('notes')}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {notes.length}/10,000
          </p>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="mt-1.5">
            <TagInput
              value={tags}
              onChange={(t) => form.setValue('tags', t)}
            />
          </div>
        </div>

        <div>
          <Label>Privacy</Label>
          <Select
            value={form.watch('privacy') || 'private'}
            onValueChange={(v) =>
              form.setValue('privacy', (v ?? 'private') as 'private' | 'shared' | 'public')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="shared">Shared (link only)</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {defaultValues ? 'Save Changes' : 'Log Bottle'}
      </Button>
    </form>
  );
};
