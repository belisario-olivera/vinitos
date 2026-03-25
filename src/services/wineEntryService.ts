import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { createServiceLogger } from '@/lib/logger';
import * as wineEntryRepo from '@/repositories/wineEntryRepository';
import type {
  WineEntry,
  CreateWineEntryDTO,
  UpdateWineEntryDTO,
  WineFilters,
} from '@/types/wine';
import type { Tag } from '@/types/tag';

const log = createServiceLogger('wineEntry');

export const getAllEntries = async (
  userId: string,
  filters?: WineFilters
): Promise<WineEntry[]> => {
  const client = await createClient();
  return wineEntryRepo.getAll(client, userId, filters);
};

export const getEntryById = async (
  userId: string,
  entryId: string
): Promise<WineEntry | null> => {
  const client = await createClient();
  const entry = await wineEntryRepo.getById(client, entryId);

  if (entry && entry.privacy === 'private') {
    const isOwner = await isEntryOwner(client, entryId, userId);
    if (!isOwner) return null;
  }

  return entry;
};

export const createEntry = async (
  userId: string,
  data: CreateWineEntryDTO
): Promise<WineEntry> => {
  const client = await createClient();
  const entry = await wineEntryRepo.create(client, userId, data);
  log.info({ entryId: entry.id, userId }, 'Wine entry created');
  return entry;
};

export const updateEntry = async (
  userId: string,
  entryId: string,
  data: UpdateWineEntryDTO
): Promise<WineEntry | null> => {
  const client = await createClient();

  if (!(await isEntryOwner(client, entryId, userId))) {
    log.warn({ entryId, userId }, 'Unauthorized update attempt');
    return null;
  }

  const updated = await wineEntryRepo.update(client, entryId, data);
  if (updated) {
    log.info({ entryId, userId }, 'Wine entry updated');
  }
  return updated;
};

export const deleteEntry = async (
  userId: string,
  entryId: string
): Promise<boolean> => {
  const client = await createClient();

  if (!(await isEntryOwner(client, entryId, userId))) {
    log.warn({ entryId, userId }, 'Unauthorized delete attempt');
    return false;
  }

  const deleted = await wineEntryRepo.deleteById(client, entryId);
  if (deleted) {
    log.info({ entryId, userId }, 'Wine entry deleted');
  }
  return deleted;
};

export const getStats = async (
  userId: string
): Promise<{ total: number; avgRating: number; topGrape: string }> => {
  const client = await createClient();
  return wineEntryRepo.getStats(client, userId);
};

export const getTags = async (userId: string): Promise<Tag[]> => {
  const client = await createClient();
  return wineEntryRepo.getDistinctTags(client, userId);
};

const isEntryOwner = async (
  client: Awaited<ReturnType<typeof createClient>>,
  entryId: string,
  userId: string
): Promise<boolean> => {
  const { data } = await client
    .from('wine_entries')
    .select('user_id')
    .eq('id', entryId)
    .single();

  return data?.user_id === userId;
};
