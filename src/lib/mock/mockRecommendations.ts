import type { RecommendedWine } from '@/types/recommendation';

const RECOMMENDATION_POOL: RecommendedWine[] = [
  {
    id: 'rec-1',
    title: 'Luigi Bosca Malbec Reserva',
    producer: 'Luigi Bosca',
    region: 'Luján de Cuyo, Argentina',
    grapes: ['Malbec'],
    vintage: 2020,
    score: 0.92,
    rationale: 'Same grape and region with similar full-bodied profile and oak treatment.',
  },
  {
    id: 'rec-2',
    title: 'Kaiken Ultra Malbec',
    producer: 'Kaiken',
    region: 'Mendoza, Argentina',
    grapes: ['Malbec'],
    vintage: 2019,
    score: 0.88,
    rationale: 'Mendoza Malbec with comparable intensity and fruit-forward style.',
  },
  {
    id: 'rec-3',
    title: 'Oyster Bay Sauvignon Blanc',
    producer: 'Oyster Bay',
    region: 'Marlborough, New Zealand',
    grapes: ['Sauvignon Blanc'],
    vintage: 2023,
    score: 0.90,
    rationale: 'Marlborough Sauvignon with similar tropical and citrus character.',
  },
  {
    id: 'rec-4',
    title: 'Sassicaia',
    producer: 'Tenuta San Guido',
    region: 'Bolgheri, Italy',
    grapes: ['Cabernet Sauvignon', 'Cabernet Franc'],
    vintage: 2018,
    score: 0.85,
    rationale: 'Another iconic Super Tuscan with Cabernet base and structured elegance.',
  },
  {
    id: 'rec-5',
    title: 'Domaine de la Romanée-Conti Échézeaux',
    producer: 'DRC',
    region: 'Burgundy, France',
    grapes: ['Pinot Noir'],
    vintage: 2019,
    score: 0.82,
    rationale: 'Premier Burgundy Pinot Noir with complexity and terroir expression.',
  },
  {
    id: 'rec-6',
    title: 'Trimbach Riesling Cuvée Frédéric Émile',
    producer: 'Trimbach',
    region: 'Alsace, France',
    grapes: ['Riesling'],
    vintage: 2017,
    score: 0.91,
    rationale: 'Alsatian Riesling with similar mineral drive and aging potential.',
  },
  {
    id: 'rec-7',
    title: 'Vega Sicilia Único',
    producer: 'Vega Sicilia',
    region: 'Ribera del Duero, Spain',
    grapes: ['Tempranillo', 'Cabernet Sauvignon'],
    vintage: 2012,
    score: 0.87,
    rationale: 'Spanish icon with similar complexity, structure, and cellar-worthiness.',
  },
  {
    id: 'rec-8',
    title: 'Cakebread Cellars Chardonnay',
    producer: 'Cakebread Cellars',
    region: 'Napa Valley, USA',
    grapes: ['Chardonnay'],
    vintage: 2021,
    score: 0.83,
    rationale: 'Elegant Chardonnay with balanced oak and mineral complexity.',
  },
  {
    id: 'rec-9',
    title: 'Château Rayas Châteauneuf-du-Pape',
    producer: 'Château Rayas',
    region: 'Rhône Valley, France',
    grapes: ['Grenache'],
    vintage: 2017,
    score: 0.93,
    rationale: 'Legendary Grenache-based Châteauneuf with similar garrigue character.',
  },
  {
    id: 'rec-10',
    title: 'Torrontés Colomé Estate',
    producer: 'Bodega Colomé',
    region: 'Salta, Argentina',
    grapes: ['Torrontés'],
    vintage: 2022,
    score: 0.78,
    rationale: 'Aromatic Argentine white with floral notes and refreshing acidity.',
  },
];

export const getRecommendationsForEntry = (entryId: string): RecommendedWine[] => {
  const seed = entryId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const shuffled = [...RECOMMENDATION_POOL].sort(
    (a, b) => ((a.id.charCodeAt(4) + seed) % 7) - ((b.id.charCodeAt(4) + seed) % 7)
  );
  return shuffled.slice(0, 4);
};
