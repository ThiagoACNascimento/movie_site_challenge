import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) console.error("Nao tem chave");

type Category = "popular" | "streaming" | "tv" | "rent" | "theater";
type Out = {
  id: number;
  title: string;
  youtubeKey: string;
  youtubeThumbMax: string;
  youtubeThumbHQ: string;
};

const CACHE = new Map<string, { at: number; data: Out[] }>();
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

function cacheSet(key: string, data: Out[]) {
  CACHE.set(key, { at: Date.now(), data });
}

async function tmdbJson(path: string, init?: RequestInit) {
  if (!TMDB_API_KEY) throw new Error("Nao tem chave");

  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
      ...(init?.headers || {}),
    },
    ...init,
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

async function listByCategory(cat: Category) {
  switch (cat) {
    case "popular": {
      const [m, t] = await Promise.all([
        tmdbJson("/discover/movie?sort_by=popularity.desc"),
        tmdbJson("/discover/tv?sort_by=popularity.desc"),
      ]);
      return [...m.results, ...t.results].sort(
        (a, b) => b.popularity - a.popularity,
      );
    }
    case "streaming": {
      const [m, t] = await Promise.all([
        tmdbJson(
          "/discover/movie?with_watch_monetization_types=flatrate&sort_by=popularity.desc",
        ),
        tmdbJson(
          "/discover/tv?with_watch_monetization_types=flatrate&sort_by=popularity.desc",
        ),
      ]);
      return [...m.results, ...t.results].sort(
        (a, b) => b.popularity - a.popularity,
      );
    }
    case "tv": {
      const data = await tmdbJson("/tv/on_the_air");
      return data.results;
    }
    case "rent": {
      const data = await tmdbJson(
        "/discover/movie?with_watch_monetization_types=rent&sort_by=popularity.desc",
      );
      return data.results;
    }
    case "theater": {
      const data = await tmdbJson("/movie/now_playing");
      return data.results;
    }
  }
}

function pickYouTubeKey(videos: any[]): string | null {
  if (!videos?.length) return null;

  const trailers = videos.filter(
    (v: any) => (v.type || "").toLowerCase() === "trailer",
  );
  const pool = trailers.length ? trailers : videos;
  const yt = pool.find((v: any) => v.site === "YouTube") || pool[0];

  return yt?.key ?? null;
}

export async function GET(req: NextRequest) {
  try {
    if (!TMDB_API_KEY)
      return NextResponse.json(
        { ok: false, error: "TMDB_API_KEY ausente" },
        { status: 500 },
      );

    const url = new URL(req.url);
    const category = (url.searchParams.get("category") ||
      "popular") as Category;
    const want = Math.max(
      1,
      Math.min(12, Number(url.searchParams.get("limit") || 8)),
    );

    const ck = `${category}:${want}`;
    const hit = cacheGet(ck);
    if (hit) return NextResponse.json({ ok: true, items: hit });

    const list = await listByCategory(category);
    const seen = new Set<number>();
    const out: Out[] = [];

    for (const it of list) {
      if (out.length >= want) break;

      const id = it.id as number;
      if (!id || seen.has(id)) continue;

      seen.add(id);

      const isMovie =
        (it.media_type ?? (it.title ? "movie" : "tv")) === "movie";
      const kind = isMovie ? "movie" : "tv";
      const title = (it.title || it.name || "").trim();

      try {
        const vids = await tmdbJson(`/${kind}/${id}/videos`);
        const key = pickYouTubeKey(vids.results || []);

        if (!key) continue;

        const youtubeThumbMax = `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
        const youtubeThumbHQ = `https://img.youtube.com/vi/${key}/hqdefault.jpg`;

        out.push({
          id,
          title,
          youtubeKey: key,
          youtubeThumbMax,
          youtubeThumbHQ,
        });
      } catch {}
    }

    cacheSet(ck, out);
    return NextResponse.json({ ok: true, items: out });
  } catch (e: any) {
    const msg = e?.message || "TMDB error";

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
