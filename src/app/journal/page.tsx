'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { WineCard } from '@/components/wine/WineCard';
import { WineFilters } from '@/components/wine/WineFilters';
import { EmptyState } from '@/components/wine/EmptyState';
import { ViewToggle } from '@/components/ViewToggle';
import { useWineEntries } from '@/hooks/useWineEntries';
import type { WineFilters as WineFiltersType } from '@/types/wine';
import type { ViewMode } from '@/types/ui';

const JournalPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<WineFiltersType>({ sort: 'newest' });
  const [searchInput, setSearchInput] = useState('');

  const debouncedFilters = useMemo(
    () => ({ ...filters, search: searchInput || undefined }),
    [filters, searchInput]
  );

  const { data: entries, isLoading } = useWineEntries(debouncedFilters);

  const handleFiltersChange = useCallback((newFilters: WineFiltersType) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">My Journal</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search wines…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      <div className="mb-6">
        <WineFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      {isLoading ? (
        <div className={
          viewMode === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-3'
        }>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-3'
          }
        >
          {entries.map((entry) => (
            <WineCard key={entry.id} entry={entry} compact={viewMode === 'grid'} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No wines match your filters"
          description="Try adjusting your search or filters, or log a new bottle."
        />
      )}

      {entries && entries.length > 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Showing {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      )}
    </div>
  );
};

export default JournalPage;
