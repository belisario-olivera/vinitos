'use client';

import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/types/ui';
import { cn } from '@/lib/utils';

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export const ViewToggle = ({ mode, onChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center rounded-md border">
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8 rounded-r-none', mode === 'grid' && 'bg-accent')}
        onClick={() => onChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8 rounded-l-none', mode === 'list' && 'bg-accent')}
        onClick={() => onChange('list')}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
