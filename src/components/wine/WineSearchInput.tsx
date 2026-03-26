'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Star, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWineSearch } from '@/hooks/useWineSearch';
import type { WineSearchResult } from '@/types/wineCatalog';

type WineSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (wine: WineSearchResult) => void;
  placeholder?: string;
  id?: string;
};

export const WineSearchInput = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search wines...',
  id,
}: WineSearchInputProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: results, isFetching } = useWineSearch(value);

  const showDropdown = open && value.trim().length >= 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (wine: WineSearchResult) => {
    onSelect(wine);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pl-8"
          autoComplete="off"
        />
        {isFetching && (
          <Loader2 className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {results && results.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto p-1">
              {results.map((wine) => (
                <li key={wine.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(wine)}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{wine.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[wine.producer, wine.region, wine.country]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    {wine.averageRating && (
                      <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="size-3 fill-current" />
                        {wine.averageRating.toFixed(1)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !isFetching && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                No wines found
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};
