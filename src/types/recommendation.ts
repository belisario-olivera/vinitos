export type RecommendedWine = {
  id: string;
  title: string;
  producer: string;
  region: string;
  grapes: string[];
  vintage: number | null;
  score: number;
  rationale: string;
};

export type SimilarWinesResponse = {
  baseEntryId: string;
  recommendations: RecommendedWine[];
};
