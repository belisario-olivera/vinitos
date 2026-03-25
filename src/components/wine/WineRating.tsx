'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type WineRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

export const WineRating = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: WineRatingProps) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = SIZE_MAP[size];

  const handleClick = (starValue: number, isHalf: boolean) => {
    if (readonly || !onChange) return;
    const newValue = isHalf ? starValue - 0.5 : starValue;
    onChange(newValue === value ? 0 : newValue);
  };

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={`Rating: ${value} out of 5`}>
      {stars.map((star) => {
        const filled = value >= star;
        const halfFilled = !filled && value >= star - 0.5;

        return (
          <span
            key={star}
            className={cn('relative', !readonly && 'cursor-pointer')}
          >
            <Star
              className={cn(
                sizeClass,
                'transition-colors',
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : halfFilled
                    ? 'text-amber-400'
                    : 'text-muted-foreground/30'
              )}
            />
            {halfFilled && (
              <Star
                className={cn(
                  sizeClass,
                  'absolute inset-0 fill-amber-400 text-amber-400'
                )}
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
            )}
            {!readonly && (
              <>
                <button
                  type="button"
                  className="absolute inset-0 w-1/2"
                  onClick={() => handleClick(star, true)}
                  aria-label={`Rate ${star - 0.5} stars`}
                />
                <button
                  type="button"
                  className="absolute inset-0 left-1/2 w-1/2"
                  onClick={() => handleClick(star, false)}
                  aria-label={`Rate ${star} stars`}
                />
              </>
            )}
          </span>
        );
      })}
      {!readonly && (
        <span className="ml-1.5 text-sm text-muted-foreground tabular-nums">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
};
