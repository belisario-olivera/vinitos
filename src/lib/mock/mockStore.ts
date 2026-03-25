import { v4 as uuidv4 } from 'uuid';
import type { WineEntry, CreateWineEntryDTO, UpdateWineEntryDTO, WineFilters } from '@/types/wine';
import type { Tag } from '@/types/tag';
import { MOCK_WINE_ENTRIES, MOCK_TAGS } from './mockData';
import { getRecommendationsForEntry } from './mockRecommendations';

let entries: WineEntry[] = [...MOCK_WINE_ENTRIES];

const matchesSearch = (entry: WineEntry, search: string): boolean => {
  const q = search.toLowerCase();
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.producer.toLowerCase().includes(q) ||
    entry.region.toLowerCase().includes(q) ||
    entry.notes.toLowerCase().includes(q) ||
    entry.grapes.some((g) => g.toLowerCase().includes(q))
  );
};

export const wineStore = {
  getAll(filters?: WineFilters): WineEntry[] {
    let result = [...entries];

    if (filters?.search) {
      result = result.filter((e) => matchesSearch(e, filters.search!));
    }
    if (filters?.tags && filters.tags.length > 0) {
      result = result.filter((e) =>
        filters.tags!.some((t) => e.tags.includes(t))
      );
    }
    if (filters?.minRating !== undefined) {
      result = result.filter((e) => e.rating >= filters.minRating!);
    }
    if (filters?.maxRating !== undefined) {
      result = result.filter((e) => e.rating <= filters.maxRating!);
    }
    if (filters?.region) {
      result = result.filter((e) => e.region === filters.region);
    }
    if (filters?.grape) {
      result = result.filter((e) =>
        e.grapes.some((g) => g.toLowerCase() === filters.grape!.toLowerCase())
      );
    }

    const sort = filters?.sort ?? 'newest';
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest-rated':
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  },

  getById(id: string): WineEntry | null {
    return entries.find((e) => e.id === id) ?? null;
  },

  create(dto: CreateWineEntryDTO): WineEntry {
    const now = new Date().toISOString();
    const entry: WineEntry = {
      id: uuidv4(),
      title: dto.title,
      vintage: dto.vintage ?? null,
      producer: dto.producer ?? '',
      region: dto.region ?? '',
      grapes: dto.grapes ?? [],
      purchaseDate: dto.purchaseDate ?? null,
      price: dto.price ?? null,
      location: dto.location ?? '',
      notes: dto.notes ?? '',
      rating: dto.rating,
      tags: dto.tags ?? [],
      privacy: dto.privacy ?? 'private',
      shareLinkId: null,
      createdAt: now,
      updatedAt: now,
    };
    entries.unshift(entry);
    return entry;
  },

  update(id: string, dto: UpdateWineEntryDTO): WineEntry | null {
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const updated: WineEntry = {
      ...entries[idx],
      ...Object.fromEntries(
        Object.entries(dto).filter(([, v]) => v !== undefined)
      ),
      updatedAt: new Date().toISOString(),
    };
    entries[idx] = updated;
    return updated;
  },

  delete(id: string): boolean {
    const len = entries.length;
    entries = entries.filter((e) => e.id !== id);
    return entries.length < len;
  },

  getSimilar(id: string) {
    return getRecommendationsForEntry(id);
  },

  getTags(): Tag[] {
    const tagCounts = new Map<string, number>();
    for (const entry of entries) {
      for (const tag of entry.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
    for (const tag of MOCK_TAGS) {
      if (!tagCounts.has(tag)) {
        tagCounts.set(tag, 0);
      }
    }
    return Array.from(tagCounts.entries())
      .map(([name, count], i) => ({ id: `tag-${i}`, name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getStats() {
    const total = entries.length;
    const avgRating = total > 0
      ? Math.round((entries.reduce((sum, e) => sum + e.rating, 0) / total) * 10) / 10
      : 0;

    const grapeCounts = new Map<string, number>();
    for (const entry of entries) {
      for (const grape of entry.grapes) {
        grapeCounts.set(grape, (grapeCounts.get(grape) ?? 0) + 1);
      }
    }
    const topGrape = grapeCounts.size > 0
      ? [...grapeCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

    return { total, avgRating, topGrape };
  },
};
