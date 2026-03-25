'use client';

import Link from 'next/link';
import { Plus, Wine, Star, Grape, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WineCard } from '@/components/wine/WineCard';
import { useWineEntries } from '@/hooks/useWineEntries';
import { useWineStats } from '@/hooks/useWineStats';

const HomePage = () => {
  const { data: entries } = useWineEntries({ sort: 'newest' });
  const { data: stats } = useWineStats();
  const recentEntries = entries?.slice(0, 6) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="py-12 text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="mx-auto w-fit rounded-full bg-primary/10 p-4">
            <Wine className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Personal
            <span className="text-primary"> Wine Journal</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Log bottles, record tasting notes, and discover wines you&apos;ll
            love. Build a beautiful, searchable archive of every bottle.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button render={<Link href="/log" />} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Log Your First Bottle
            </Button>
            <Button render={<Link href="/journal" />} variant="outline" size="lg">
              Browse Journal
            </Button>
          </div>
        </div>
      </section>

      {stats && stats.total > 0 && (
        <section className="mb-10">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="rounded-full bg-primary/10 p-2.5">
                  <Wine className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Bottles logged</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="rounded-full bg-amber-100 p-2.5">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgRating}</p>
                  <p className="text-sm text-muted-foreground">Avg. rating</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="rounded-full bg-green-100 p-2.5">
                  <Grape className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.topGrape}</p>
                  <p className="text-sm text-muted-foreground">Top grape</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {recentEntries.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Entries</h2>
            <Button render={<Link href="/journal" />} variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentEntries.map((entry) => (
              <WineCard key={entry.id} entry={entry} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
