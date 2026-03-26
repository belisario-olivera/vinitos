export type WineCatalogEntry = {
  id: string;
  vivinoWineId: number;
  name: string;
  producer: string;
  region: string;
  country: string;
  grapes: string[];
  averageRating: number | null;
  ratingsCount: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WineSearchResult = {
  id: string;
  vivinoWineId: number;
  name: string;
  producer: string;
  region: string;
  country: string;
  grapes: string[];
  averageRating: number | null;
  ratingsCount: number;
  imageUrl: string | null;
};
