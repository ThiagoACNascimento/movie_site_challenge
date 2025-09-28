"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResp = { ok: boolean; images: { url: string }[]; error?: string };

const INTERVAL_MS = 15000; // 15s entre trocas

export default function Hero() {
  const [imgs, setImgs] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // busca uma vez na montagem
  useEffect(() => {
    let mounted = true;
    (async () => 
    {
      try 
      {
        setError(null);

        const res = await fetch("/api/tmdb/posterItem?limit=10", { cache: "no-store" });

        if (!res.ok) 
          throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const data: ApiResp = await res.json();

        if (!data.ok) 
          throw new Error(data.error || "Falha ao carregar imagens");

        if (mounted) 
          setImgs(data.images?.map(i => i.url) ?? []);
      } 
      catch (e: any) 
      {
        if (mounted) 
          setError(e.message || "Erro ao carregar imagens");
        console.error("[Hero BG API Error]", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // troca aleatória
  useEffect(() => {
    if (imgs.length <= 1) 
      return;

    const id = setInterval(() => 
    {
      setIdx(i => {
        let next = i;
        while (next === i && imgs.length > 1) 
          next = Math.floor(Math.random() * imgs.length);
        
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [imgs]);

  // pré-carrega a próxima aleatória
  const nextUrl = useMemo(() => {
    if (imgs.length < 2) 
      return null;

    let next = idx;
    while (next === idx)
       next = Math.floor(Math.random() * imgs.length);

    return imgs[next];
  }, [imgs, idx]);

  useEffect(() => {
    if (!nextUrl) 
      return;

    const img = new Image();

    img.src = nextUrl;
  }, [nextUrl]);

  return (
    <section className="relative hidden md:block h-[40vh] min-h-[420px]">
      {imgs.length > 0 ? (
        imgs.map((url, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${url})`,
              // foco um pouco mais alto para evitar cortar rosto/cabeças
              backgroundPosition: "center 35%",
              opacity: i === idx ? 1 : 0,
            }}
            aria-hidden
          />
        ))
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-stone-900 via-black to-stone-950"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#1D1E2C]/80 via-black/60 to-black"
      />

      <div className="relative z-20 flex h-full items-center justify-center text-center font-serif px-5 sm:px-6">
        <div className="space-y-4">
          <h1 className="text-white text-5xl sm:text-6xl font-extrabold tracking-tight">Welcome.</h1>
          <h2 className="text-white/95 text-2xl sm:text-3xl font-semibold max-w-4xl mx-auto">
            Millions of movies, TV shows and people to discover. Explore now.
          </h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    </section>
  );
}
