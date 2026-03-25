export type WinePrivacy = 'private' | 'shared' | 'public';

export type Rating = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export type WineEntry = {
  id: string;
  title: string;
  vintage: number | null;
  producer: string;
  region: string;
  grapes: string[];
  purchaseDate: string | null;
  price: number | null;
  location: string;
  notes: string;
  rating: number;
  tags: string[];
  privacy: WinePrivacy;
  shareLinkId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateWineEntryDTO = {
  title: string;
  vintage?: number | null;
  producer?: string;
  region?: string;
  grapes?: string[];
  purchaseDate?: string | null;
  price?: number | null;
  location?: string;
  notes?: string;
  rating: number;
  tags?: string[];
  privacy?: WinePrivacy;
};

export type UpdateWineEntryDTO = Partial<CreateWineEntryDTO>;

export type WineFilters = {
  search?: string;
  tags?: string[];
  minRating?: number;
  maxRating?: number;
  region?: string;
  grape?: string;
  sort?: WineSortOption;
};

export type WineSortOption = 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated';
