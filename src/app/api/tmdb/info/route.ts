import { NextRequest, NextResponse } from "next/server";

const TMDB = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest) {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "TMDB_API_KEY ausente" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "id obrigatório" },
      { status: 400 },
    );
  }

  // tenta FILME primeiro (SEM append)
  const movieResp = await fetch(`${TMDB}/movie/${id}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  if (movieResp.ok) {
    const d = await movieResp.json();
    return NextResponse.json({
      ok: true,
      kind: "movie",
      data: {
        id: d.id,
        title: d.title,
        year: d.release_date?.slice(0, 4) ?? null,
        poster: d.poster_path
          ? `https://image.tmdb.org/t/p/w342${d.poster_path}`
          : null,
      },
    });
  }

  // se não for filme, tenta TV (SEM append)
  const tvResp = await fetch(`${TMDB}/tv/${id}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  if (tvResp.ok) {
    const d = await tvResp.json();
    return NextResponse.json({
      ok: true,
      kind: "tv",
      data: {
        id: d.id,
        title: d.name,
        year: d.first_air_date?.slice(0, 4) ?? null,
        poster: d.poster_path
          ? `https://image.tmdb.org/t/p/w342${d.poster_path}`
          : null,
      },
    });
  }

  return NextResponse.json(
    { ok: false, error: "não encontrado" },
    { status: 404 },
  );
}
