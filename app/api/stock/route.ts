import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24h server cache

type Photo = {
  id: string;
  url: string;          // image URL (medium / large)
  thumb: string;        // small URL (placeholder)
  width: number;
  height: number;
  alt: string;
  author: string;
  authorUrl: string;
  source: 'unsplash' | 'pexels' | 'pixabay';
  sourceUrl: string;
};

async function searchUnsplash(query: string, count: number): Promise<Photo[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`;
  const r = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' },
    next: { revalidate: 86400 },
  });
  if (!r.ok) return [];
  const data: { results?: Array<Record<string, any>> } = await r.json();
  return (data.results ?? []).map((p) => ({
    id: `u-${p.id}`,
    url: p.urls?.regular ?? p.urls?.small,
    thumb: p.urls?.thumb,
    width: p.width,
    height: p.height,
    alt: p.alt_description ?? p.description ?? query,
    author: p.user?.name ?? 'Unsplash',
    authorUrl: p.user?.links?.html ?? 'https://unsplash.com',
    source: 'unsplash',
    sourceUrl: p.links?.html ?? 'https://unsplash.com',
  }));
}

async function searchPexels(query: string, count: number): Promise<Photo[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  const r = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 86400 } });
  if (!r.ok) return [];
  const data: { photos?: Array<Record<string, any>> } = await r.json();
  return (data.photos ?? []).map((p) => ({
    id: `p-${p.id}`,
    url: p.src?.large,
    thumb: p.src?.small,
    width: p.width,
    height: p.height,
    alt: p.alt ?? query,
    author: p.photographer ?? 'Pexels',
    authorUrl: p.photographer_url ?? 'https://pexels.com',
    source: 'pexels',
    sourceUrl: p.url ?? 'https://pexels.com',
  }));
}

async function searchPixabay(query: string, count: number): Promise<Photo[]> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];
  const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&per_page=${count}&image_type=photo&orientation=horizontal&safesearch=true&min_width=1280`;
  const r = await fetch(url, { next: { revalidate: 86400 } });
  if (!r.ok) return [];
  const data: { hits?: Array<Record<string, any>> } = await r.json();
  return (data.hits ?? []).map((p) => ({
    id: `x-${p.id}`,
    url: p.largeImageURL ?? p.webformatURL,
    thumb: p.previewURL,
    width: p.imageWidth,
    height: p.imageHeight,
    alt: p.tags ?? query,
    author: p.user ?? 'Pixabay',
    authorUrl: `https://pixabay.com/users/${p.user}-${p.user_id}/`,
    source: 'pixabay',
    sourceUrl: p.pageURL ?? 'https://pixabay.com',
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') ?? 'accounting').slice(0, 80);
  const count = Math.min(12, Math.max(1, Number(searchParams.get('count') ?? 6)));

  const settled = await Promise.allSettled([
    searchUnsplash(query, count),
    searchPexels(query, count),
    searchPixabay(query, count),
  ]);

  const all: Photo[] = settled.flatMap((s) => (s.status === 'fulfilled' ? s.value : []));
  // Interleave by source so the grid feels mixed
  const bySource: Record<string, Photo[]> = { unsplash: [], pexels: [], pixabay: [] };
  for (const p of all) bySource[p.source].push(p);
  const mixed: Photo[] = [];
  for (let i = 0; i < count; i++) {
    for (const k of ['unsplash', 'pexels', 'pixabay'] as const) {
      const next = bySource[k].shift();
      if (next) mixed.push(next);
      if (mixed.length >= count) break;
    }
    if (mixed.length >= count) break;
  }

  return new Response(JSON.stringify({ query, photos: mixed.slice(0, count) }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
