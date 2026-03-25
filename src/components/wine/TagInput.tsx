'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTags } from '@/hooks/useTags';

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export const TagInput = ({ value, onChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const { data: availableTags } = useTags();

  const suggestions = availableTags
    ?.filter(
      (t) =>
        t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(t.name)
    )
    .slice(0, 5) ?? [];

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().toLowerCase();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInputValue('');
    },
    [value, onChange]
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          placeholder="Type a tag and press Enter…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {inputValue && suggestions.length > 0 && (
          <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => addTag(tag.name)}
              >
                <span>{tag.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tag.count} entries
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
