"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type InfoResp =
  | {
      ok: true;
      data: { title: string; year: string | null; poster: string | null };
    }
  | { ok: false; error: string };

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InfoResp | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/tmdb/info?id=${id}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const json: InfoResp = await res.json();
        if (alive) setData(json);
      } catch (e) {
        if (alive) setData({ ok: false, error: "Falha ao buscar dados." });
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!data) {
    return <div className="text-white p-6">Carregando…</div>;
  }

  if (!data.ok) {
    return <div className="text-white p-6">Erro: {data.error}</div>;
  }

  const { title, year, poster } = data.data;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6">
        {title}
        {year ? <span className="text-white/70 text-2xl">({year})</span> : null}
      </h1>

      {poster ? (
        <Image
          src={poster}
          alt={title}
          width={342}
          height={513}
          className="rounded-xl ring-1 ring-white/10"
          priority
        />
      ) : (
        <div className="aspect-[2/3] w-[300px] bg-white/10 rounded-xl grid place-items-center">
          sem imagem
        </div>
      )}
    </main>
  );
}
