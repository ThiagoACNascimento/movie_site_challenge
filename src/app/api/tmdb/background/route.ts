import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) console.error("Nao tem chave");

type ImgOut = { url: string };

const CACHE = new Map<string, { at: number; data: ImgOut[] }>();
const TTL_MS = 10000 * 60;

function cacheGet(key: string) {
  const hit = CACHE.get(key);

  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) {
    CACHE.delete(key);
    return null;
  }

  return hit.data;
}

function cacheSet(key: string, data: ImgOut[]) {
  CACHE.set(key, { at: Date.now(), data });
}

async function tmdbJson(path: string) {
  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      msg = body?.status_message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

// escolhe o melhor backdrop
function pickBestBackdrop(backdrops: any[]) {
  if (!backdrops?.length) return null;

  const score = (b: any) => {
    const ar = b.aspect_ratio ?? (b.width && b.height ? b.width / b.height : 0);
    const closeness = 1 - Math.abs(ar - 1.7);
    const width = b.width || 0;
    const votes = (b.vote_count || 0) * 2 + (b.vote_average || 0);
    const hi = width >= 1920 ? 0.5 : 0;

    return closeness * 3 + width / 2000 + hi + votes / 100;
  };

  const sorted = [...backdrops].sort((a, b) => score(b) - score(a));

  return sorted[0] || null;
}

async function getCinematicBackgrounds(limit: number) {
  const trend = await tmdbJson("/trending/all/day");
  const out: ImgOut[] = [];
  const seen = new Set<string>();

  // percorre e tenta pegar o melhor backdrop de cada um
  for (const it of trend.results ?? []) {
    if (out.length >= limit) break;

    const id = it.id;
    const kind = (it.media_type ?? (it.title ? "movie" : "tv")) as
      | "movie"
      | "tv";

    if (it.backdrop_path) {
      const url = `https://image.tmdb.org/t/p/original${it.backdrop_path}`;
      if (!seen.has(url)) {
        seen.add(url);
        out.push({ url });
        continue;
      }
    }

    try {
      const imgs = await tmdbJson(`/${kind}/${id}/images`);
      const best = pickBestBackdrop(imgs.backdrops || []);
      if (best?.file_path) {
        const url = `https://image.tmdb.org/t/p/original${best.file_path}`;
        if (!seen.has(url)) {
          seen.add(url);
          out.push({ url });
        }
      }
    } catch {}
  }

  if (out.length < limit) {
    const more = await tmdbJson("/trending/all/week");

    for (const it of more.results ?? []) {
      if (out.length >= limit) break;
      if (!it.backdrop_path) continue;

      const url = `https://image.tmdb.org/t/p/original${it.backdrop_path}`;
      if (seen.has(url)) continue;
      seen.add(url);
      out.push({ url });
    }
  }

  return out.slice(0, limit);
}

export async function GET(req: NextRequest) {
  try {
    if (!TMDB_API_KEY)
      return NextResponse.json(
        { ok: false, error: "Nao tem chave" },
        { status: 500 },
      );

    const url = new URL(req.url);
    const limit = Math.max(
      1,
      Math.min(20, Number(url.searchParams.get("limit") || 8)),
    );

    const ck = `bg2:${limit}`;
    const hit = cacheGet(ck);

    if (hit) return NextResponse.json({ ok: true, images: hit });

    const images = await getCinematicBackgrounds(limit);
    cacheSet(ck, images);

    return NextResponse.json({ ok: true, images });
  } catch (e: any) {
    const msg = e?.message || "TMDB error";

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
