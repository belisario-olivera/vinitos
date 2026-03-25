import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  WineEntry,
  CreateWineEntryDTO,
  UpdateWineEntryDTO,
  WineFilters,
  WinePrivacy,
} from '@/types/wine';
import type { Tag } from '@/types/tag';

type WineEntryRow = {
  id: string;
  user_id: string;
  title: string;
  vintage: number | null;
  producer: string;
  region: string;
  grapes: string[];
  purchase_date: string | null;
  price: number | null;
  location: string;
  notes: string;
  rating: number;
  tags: string[];
  privacy: WinePrivacy;
  share_link_id: string | null;
  created_at: string;
  updated_at: string;
};

const mapRowToEntry = (row: WineEntryRow): WineEntry => ({
  id: row.id,
  title: row.title,
  vintage: row.vintage,
  producer: row.producer,
  region: row.region,
  grapes: row.grapes,
  purchaseDate: row.purchase_date,
  price: row.price ? Number(row.price) : null,
  location: row.location,
  notes: row.notes,
  rating: Number(row.rating),
  tags: row.tags,
  privacy: row.privacy,
  shareLinkId: row.share_link_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getAll = async (
  client: SupabaseClient,
  userId: string,
  filters?: WineFilters
): Promise<WineEntry[]> => {
  let query = client
    .from('wine_entries')
    .select('*')
    .eq('user_id', userId);

  if (filters?.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `title.ilike.${term},producer.ilike.${term},region.ilike.${term},notes.ilike.${term}`
    );
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.minRating !== undefined) {
    query = query.gte('rating', filters.minRating);
  }

  if (filters?.maxRating !== undefined) {
    query = query.lte('rating', filters.maxRating);
  }

  if (filters?.region) {
    query = query.eq('region', filters.region);
  }

  if (filters?.grape) {
    query = query.contains('grapes', [filters.grape]);
  }

  const sort = filters?.sort ?? 'newest';
  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'highest-rated':
      query = query.order('rating', { ascending: false });
      break;
    case 'lowest-rated':
      query = query.order('rating', { ascending: true });
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch wine entries: ${error.message}`);
  }

  return (data as WineEntryRow[]).map(mapRowToEntry);
};

export const getById = async (
  client: SupabaseClient,
  id: string
): Promise<WineEntry | null> => {
  const { data, error } = await client
    .from('wine_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch wine entry: ${error.message}`);
  }

  return mapRowToEntry(data as WineEntryRow);
};

export const create = async (
  client: SupabaseClient,
  userId: string,
  dto: CreateWineEntryDTO
): Promise<WineEntry> => {
  const { data, error } = await client
    .from('wine_entries')
    .insert({
      user_id: userId,
      title: dto.title,
      vintage: dto.vintage ?? null,
      producer: dto.producer ?? '',
      region: dto.region ?? '',
      grapes: dto.grapes ?? [],
      purchase_date: dto.purchaseDate ?? null,
      price: dto.price ?? null,
      location: dto.location ?? '',
      notes: dto.notes ?? '',
      rating: dto.rating,
      tags: dto.tags ?? [],
      privacy: dto.privacy ?? 'private',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create wine entry: ${error.message}`);
  }

  return mapRowToEntry(data as WineEntryRow);
};

export const update = async (
  client: SupabaseClient,
  id: string,
  dto: UpdateWineEntryDTO
): Promise<WineEntry | null> => {
  const updateData: Record<string, unknown> = {};

  if (dto.title !== undefined) updateData.title = dto.title;
  if (dto.vintage !== undefined) updateData.vintage = dto.vintage;
  if (dto.producer !== undefined) updateData.producer = dto.producer;
  if (dto.region !== undefined) updateData.region = dto.region;
  if (dto.grapes !== undefined) updateData.grapes = dto.grapes;
  if (dto.purchaseDate !== undefined) updateData.purchase_date = dto.purchaseDate;
  if (dto.price !== undefined) updateData.price = dto.price;
  if (dto.location !== undefined) updateData.location = dto.location;
  if (dto.notes !== undefined) updateData.notes = dto.notes;
  if (dto.rating !== undefined) updateData.rating = dto.rating;
  if (dto.tags !== undefined) updateData.tags = dto.tags;
  if (dto.privacy !== undefined) updateData.privacy = dto.privacy;

  if (Object.keys(updateData).length === 0) {
    return getById(client, id);
  }

  const { data, error } = await client
    .from('wine_entries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to update wine entry: ${error.message}`);
  }

  return mapRowToEntry(data as WineEntryRow);
};

export const deleteById = async (
  client: SupabaseClient,
  id: string
): Promise<boolean> => {
  const { error, count } = await client
    .from('wine_entries')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete wine entry: ${error.message}`);
  }

  return (count ?? 0) > 0;
};

export const getStats = async (
  client: SupabaseClient,
  userId: string
): Promise<{ total: number; avgRating: number; topGrape: string }> => {
  const { data, error } = await client
    .from('wine_entries')
    .select('rating, grapes')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }

  const entries = data as { rating: number; grapes: string[] }[];
  const total = entries.length;

  if (total === 0) {
    return { total: 0, avgRating: 0, topGrape: 'N/A' };
  }

  const avgRating =
    Math.round(
      (entries.reduce((sum, e) => sum + Number(e.rating), 0) / total) * 10
    ) / 10;

  const grapeCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const grape of entry.grapes) {
      grapeCounts.set(grape, (grapeCounts.get(grape) ?? 0) + 1);
    }
  }

  const topGrape =
    grapeCounts.size > 0
      ? [...grapeCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

  return { total, avgRating, topGrape };
};

export const getDistinctTags = async (
  client: SupabaseClient,
  userId: string
): Promise<Tag[]> => {
  const { data, error } = await client
    .from('wine_entries')
    .select('tags')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  const tagCounts = new Map<string, number>();
  for (const row of data as { tags: string[] }[]) {
    for (const tag of row.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([name, count], i) => ({ id: `tag-${i}`, name, count }))
    .sort((a, b) => b.count - a.count);
};
