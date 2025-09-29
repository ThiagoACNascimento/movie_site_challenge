"use client";

import { useEffect, useState, useCallback } from "react";
import ButtonGroup from "@/app/ui/buttonGroup";
import SkeletonCard from "@/app/ui/skeletonPoster";

type Category = "popular" | "streaming" | "tv" | "rent" | "theater";
type Item = {
  id: number;
  title: string;
  poster: string | null;
  youtubeKey: string;
  youtubeThumbMax: string;
  youtubeThumbHQ: string;
};

const OPTIONS: Category[] = ["popular", "streaming", "tv", "rent", "theater"];
const LABELS = {
  popular: "Popular",
  streaming: "Streaming",
  tv: "On TV",
  rent: "For Rent",
  theater: "In Theaters",
} as const;

export default function TrailerSection() {
  const [category, setCategory] = useState<Category>("popular");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Item | null>(null);
  const [hoverBg, setHoverBg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tmdb/trailer?category=${category}&limit=8`,
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const data: { ok: boolean; items: Item[]; error?: string } =
          await res.json();

        if (!data.ok) throw new Error(data.error || "Falha na API");

        if (alive) setItems(data.items ?? []);
      } catch (e: any) {
        if (alive) setError(e.message || "Erro ao carregar trailers");
        console.error("Falha na API", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [category]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = useCallback((it: Item) => setActive(it), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <section className="max-w-7xl mx-auto w-full px-6 sm:px-10">
      <header className="flex items-center justify-between gap-6">
        <h3 className="text-white text-2xl font-semibold z-1">
          Latest Trailers
        </h3>
        <div
          role="tablist"
          aria-label="Trailer categories"
          className="inline-flex rounded-full bg-stone-800 p-1 ring-1 ring-white/10"
        >
          <ButtonGroup
            options={OPTIONS}
            selected={category}
            onChange={setCategory}
            labels={LABELS as any}
          />
        </div>
      </header>

      {/*background borrado*/}
      <div aria-hidden className="relative mt-2 -mx-6 sm:-mx-10 h-0">
        <div
          className={`pointer-events-none absolute inset-x-0 -top-8 h-64 transition-opacity duration-500 ${hoverBg ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: hoverBg
              ? `linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 100%), url(${hoverBg})`
              : undefined,
            backgroundPosition: "center 40%",
            backgroundSize: "cover",
            filter: "blur(8px)",
          }}
        />
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-3 [&>*]:shrink-0 relative scrollbar scrollbar-hide-until-hover">
        {loading ? (
          <SkeletonCard count={8} width="w-64 sm:w-72" height="aspect-[16/9]" />
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          items.map((it) => (
            <article
              key={it.id}
              className="w-64 sm:w-72"
              onMouseEnter={() => setHoverBg(it.poster ?? it.youtubeThumbHQ)}
              onMouseLeave={() => setHoverBg(null)}
            >
              <div className="relative">
                <div className="aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5 group">
                  {/*thumb do youtube*/}
                  <img
                    src={it.youtubeThumbMax}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        it.youtubeThumbHQ;
                    }}
                    alt={it.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center">
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white drop-shadow"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  <button
                    aria-label={`Assistir trailer de ${it.title}`}
                    onClick={() => open(it)}
                    className="absolute inset-0 z-10"
                  />
                </div>
              </div>

              <h4 className="mt-4 line-clamp-2 text-white/90 text-sm font-bold text-center">
                {it.title}
              </h4>
            </article>
          ))
        )}

        <div
          aria-hidden
          className="pointer-events-none sticky right-0 self-stretch w-12 z-10 bg-gradient-to-l from-black to-transparent"
        />
      </div>

      {/*Video do youtube*/}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${active.youtubeKey}?autoplay=1&rel=0&modestbranding=1`}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-sm px-3 py-1 rounded-md bg-white/10 ring-1 ring-white/20"
          >
            Fechar
          </button>
        </div>
      )}
    </section>
  );
}
