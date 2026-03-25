'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WineFilters as WineFiltersType, WineSortOption } from '@/types/wine';
import { WINE_REGIONS, WINE_GRAPES } from '@/lib/constants/wine';

type WineFiltersProps = {
  filters: WineFiltersType;
  onChange: (filters: WineFiltersType) => void;
};

const SORT_OPTIONS: { value: WineSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest-rated', label: 'Highest rated' },
  { value: 'lowest-rated', label: 'Lowest rated' },
];

const RATING_OPTIONS = [
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '4.5', label: '4.5+' },
];

export const WineFilters = ({ filters, onChange }: WineFiltersProps) => {
  const hasActiveFilters =
    !!filters.region ||
    !!filters.grape ||
    !!filters.minRating ||
    (filters.tags && filters.tags.length > 0);

  const update = (partial: Partial<WineFiltersType>) => {
    onChange({ ...filters, ...partial });
  };

  const clearAll = () => {
    onChange({ search: filters.search, sort: filters.sort });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.sort ?? 'newest'}
          onValueChange={(v) => update({ sort: v as WineSortOption })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.region ?? '__all__'}
          onValueChange={(v) => update({ region: v === '__all__' || !v ? undefined : v })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All regions</SelectItem>
            {WINE_REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.grape ?? '__all__'}
          onValueChange={(v) => update({ grape: v === '__all__' || !v ? undefined : v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All grapes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All grapes</SelectItem>
            {WINE_GRAPES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.minRating?.toString() ?? '__all__'}
          onValueChange={(v) =>
            update({ minRating: v === '__all__' || !v ? undefined : Number(v) })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Min rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Any rating</SelectItem>
            {RATING_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label} stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {filters.region && (
            <Badge variant="secondary" className="gap-1">
              {filters.region}
              <button onClick={() => update({ region: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.grape && (
            <Badge variant="secondary" className="gap-1">
              {filters.grape}
              <button onClick={() => update({ grape: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ stars
              <button onClick={() => update({ minRating: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
