'use client';

import { Sparkles, MapPin, Grape } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSimilarWines } from '@/hooks/useSimilarWines';

type SimilarWinesProps = {
  entryId: string;
  enabled: boolean;
};

export const SimilarWines = ({ entryId, enabled }: SimilarWinesProps) => {
  const { data, isLoading } = useSimilarWines(entryId, enabled);

  if (!enabled) return null;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          Finding similar wines…
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-28" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.recommendations.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        Similar Wines
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.recommendations.map((rec) => (
          <Card key={rec.id}>
            <CardHeader className="pb-1.5">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm">{rec.title}</CardTitle>
                <Badge variant="outline" className="ml-2 shrink-0 text-[10px]">
                  {Math.round(rec.score * 100)}% match
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{rec.producer}</p>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {rec.region}
                </span>
                <span className="flex items-center gap-1">
                  <Grape className="h-3 w-3" />
                  {rec.grapes.join(', ')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                {rec.rationale}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
