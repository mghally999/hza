import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24h

type VideoFile = { link: string; width: number; height: number; quality?: string };
type Video = {
  id: string;
  url: string;            // best MP4
  poster: string;         // thumbnail
  width: number;
  height: number;
  duration: number;
  alt: string;
};

/**
 * Picks a sensibly-sized MP4 from Pexels' `video_files` array.
 * Prefers HD (720–1080p) so it loads fast and looks crisp.
 */
function pickFile(files: VideoFile[]): VideoFile | null {
  if (!files?.length) return null;
  const mp4 = files.filter((f) => /\.mp4($|\?)/i.test(f.link));
  const target = mp4.length ? mp4 : files;
  // Sort by closeness to 1080p height
  const ranked = [...target].sort((a, b) => {
    const da = Math.abs((a.height || 0) - 1080);
    const db = Math.abs((b.height || 0) - 1080);
    return da - db;
  });
  return ranked[0];
}

async function searchPexelsVideo(query: string, count: number): Promise<Video[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&size=medium`;
  const r = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 86400 } });
  if (!r.ok) return [];
  const data: { videos?: Array<Record<string, any>> } = await r.json();
  const out: Video[] = [];
  for (const v of data.videos ?? []) {
    const file = pickFile(v.video_files as VideoFile[]);
    if (!file) continue;
    const poster =
      (v.video_pictures && v.video_pictures[0]?.picture) ||
      v.image ||
      '';
    out.push({
      id: `pv-${v.id}`,
      url: file.link,
      poster,
      width: file.width || v.width,
      height: file.height || v.height,
      duration: v.duration,
      alt: v.url ?? query,
    });
  }
  return out;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') ?? 'business suit').slice(0, 80);
  const count = Math.min(8, Math.max(1, Number(searchParams.get('count') ?? 4)));

  const videos = await searchPexelsVideo(query, count);

  return new Response(JSON.stringify({ query, videos }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
