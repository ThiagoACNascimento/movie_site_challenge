// app/api/tmdb/trending/route.ts
import { NextRequest, NextResponse } from "next/server";

const TMDB_BEARER = process.env.TMDB_API_KEY;
if (!TMDB_BEARER) console.error("Faltando TMDB_API_KEY");

type Range = "day" | "week";

type OutItem = {
  id: number;
  title: string;
  poster: string | null;
  vote: number;
  year: number | null;
  month: string | null;
  day: number | null;
};

const CACHE = new Map<string, { at: number; data: OutItem[] }>();
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
function cacheSet(key: string, data: OutItem[]) {
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
  if (!TMDB_BEARER) throw new Error("TMDB_API_KEY ausente");

  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_BEARER}`,
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
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function GET(req: NextRequest) {
  try {
    if (!TMDB_BEARER)
      return NextResponse.json(
        { ok: false, error: "TMDB_API_KEY ausente" },
        { status: 500 },
      );

    const url = new URL(req.url);
    const range = (url.searchParams.get("range") || "day") as Range;
    const limit = Math.max(
      1,
      Math.min(40, Number(url.searchParams.get("limit") || 20)),
    );

    const ck = `${range}:${limit}`;
    const hit = cacheGet(ck);
    if (hit) return NextResponse.json({ ok: true, items: hit });

    const data = await tmdbJson(`/trending/all/${range}`);
    const items: OutItem[] = (data.results || [])
      .slice(0, limit)
      .map((it: any) => {
        const title = (it.title || it.name || "").trim();
        const poster = it.poster_path
          ? `https://image.tmdb.org/t/p/w500${it.poster_path}`
          : null;
        const vote = Math.round((Number(it.vote_average) || 0) * 10); // 0–10 → 0–100
        const d = dateParts(it.release_date || it.first_air_date || null);
        return { id: it.id, title, poster, vote, ...d };
      });

    cacheSet(ck, items);
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    const msg = e?.message || "TMDB error";

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
