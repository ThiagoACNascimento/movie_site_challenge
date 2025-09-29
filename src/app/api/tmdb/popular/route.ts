import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) console.error("Sem chave");

type Category = "streaming" | "tv" | "rent" | "theater";
type Out = {
  id: number;
  title: string;
  poster: string | null;
  vote: number;
  year: number | null;
  month: string | null;
  day: number | null;
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

function dateParts(d?: string | null) {
  if (!d) return { year: null, month: null, day: null };

  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return { year: null, month: null, day: null };

  const month = dt.toLocaleString("en-US", { month: "short" });

  return { year: dt.getFullYear(), month, day: dt.getDate() };
}

async function tmdbJson(path: string, init?: RequestInit) {
  if (!TMDB_API_KEY) throw new Error("Nao tem chave");

  const url = `https://api.themoviedb.org/3${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
      ...(init?.headers || {}),
    },
    ...init,
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      msg = (body && (body.status_message || body.message)) || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

async function listByCategory(cat: Category) {
  switch (cat) {
    case "streaming": {
      const [m, t] = await Promise.all([
        tmdbJson(
          "/discover/movie?with_watch_monetization_types=flatrate&sort_by=popularity.desc",
        ),
        tmdbJson(
          "/discover/tv?with_watch_monetization_types=flatrate&sort_by=popularity.desc",
        ),
      ]);
      const mix = [...(m.results ?? []), ...(t.results ?? [])];
      return mix.sort(
        (a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0),
      );
    }
    case "tv": {
      const data = await tmdbJson("/discover/tv?sort_by=popularity.desc");
      return data.results ?? [];
    }
    case "rent": {
      const data = await tmdbJson(
        "/discover/movie?with_watch_monetization_types=rent&sort_by=popularity.desc",
      );
      return data.results ?? [];
    }
    case "theater": {
      const data = await tmdbJson("/movie/now_playing");
      return data.results ?? [];
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!TMDB_API_KEY)
      return NextResponse.json(
        { ok: false, error: "Nao tem chave" },
        { status: 500 },
      );

    const url = new URL(req.url);
    const category = (url.searchParams.get("category") ||
      "streaming") as Category;
    const want = Math.max(
      1,
      Math.min(40, Number(url.searchParams.get("limit") || 20)),
    );

    const ck = `${category}:${want}`;
    const cached = cacheGet(ck);

    if (cached) return NextResponse.json({ ok: true, items: cached });

    const list = await listByCategory(category);

    const seen = new Set<number>();
    const out: Out[] = [];

    for (const it of list ?? []) {
      if (out.length >= want) break;

      const id = Number((it as any).id);

      if (!id || seen.has(id)) continue;

      seen.add(id);

      const title = String((it as any).title || (it as any).name || "").trim();
      const posterPath = (it as any).poster_path as string | null | undefined;
      const poster = posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : null;
      const vote = Math.round((Number(it.vote_average) || 0) * 10);
      const d = dateParts(it.release_date || it.first_air_date || null);

      out.push({ id, title, poster, vote, ...d });
    }

    cacheSet(ck, out);
    return NextResponse.json({ ok: true, items: out });
  } catch (e: any) {
    const msg = e?.message || "Erro na chave";

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
