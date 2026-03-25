'use client';

import Link from 'next/link';
import { MapPin, Grape, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WineRating } from '@/components/wine/WineRating';
import { PrivacyBadge } from '@/components/wine/PrivacyBadge';
import type { WineEntry } from '@/types/wine';

type WineCardProps = {
  entry: WineEntry;
  compact?: boolean;
};

export const WineCard = ({ entry, compact = false }: WineCardProps) => {
  return (
    <Link href={`/entry/${entry.id}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold leading-tight group-hover:text-primary transition-colors">
                {entry.title}
              </h3>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {entry.producer}
                {entry.vintage && ` · ${entry.vintage}`}
              </p>
            </div>
            <PrivacyBadge privacy={entry.privacy} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <WineRating value={entry.rating} readonly size="sm" />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {entry.region && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {entry.region}
              </span>
            )}
            {entry.grapes.length > 0 && (
              <span className="flex items-center gap-1">
                <Grape className="h-3 w-3" />
                {entry.grapes.slice(0, 2).join(', ')}
                {entry.grapes.length > 2 && ` +${entry.grapes.length - 2}`}
              </span>
            )}
            {entry.price !== null && (
              <span>${entry.price}</span>
            )}
          </div>

          {!compact && entry.notes && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {entry.notes}
            </p>
          )}

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  +{entry.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
            <Calendar className="h-3 w-3" />
            {new Date(entry.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
