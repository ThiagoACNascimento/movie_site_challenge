// app/components/main_page/catalog/catalogSection.tsx
"use client";

import { useEffect, useState } from "react";
import ButtonGroup from "@/app/ui/buttonGroup";
import SkeletonCard from "@/app/ui/skeletonPoster";
import RatingRing from "@/app/ui/rating-ring";

type Category = "streaming" | "tv" | "rent" | "theater";

type Item = {
  id: number;
  title: string;
  poster: string | null;
  vote: number;
  year: number | null;
  month: string | null;
  day: number | null;
};

const OPTIONS: Category[] = ["streaming", "tv", "rent", "theater"];
const LABELS: Record<Category, string> = {
  streaming: "Streaming",
  tv: "On TV",
  rent: "For Rent",
  theater: "In Theaters",
};

export default function Popular() {
  const [category, setCategory] = useState<Category>("streaming");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverPoster, setHoverPoster] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tmdb/popular?category=${category}&limit=20`,
          {
            cache: "no-store",
          },
        );

        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

        const data: { ok: boolean; items: Item[]; error?: string } =
          await res.json();
        if (!data.ok) throw new Error(data.error || "Falha na API");

        if (alive) setItems(data.items ?? []);
      } catch (e: any) {
        if (alive) setError(e.message || "Erro ao carregar");
        console.error("[Catalog API Error]", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [category]);

  return (
    <section className="max-w-7xl mx-auto w-full px-6 sm:px-10">
      <header className="flex items-center justify-between gap-6">
        <h3 className="text-white text-2xl font-semibold z-10">
          What's Popular
        </h3>

        <div
          role="tablist"
          aria-label="Catalog categories"
          className="inline-flex rounded-full bg-stone-800 p-1 ring-1 ring-white/10"
        >
          <ButtonGroup
            options={OPTIONS}
            selected={category}
            onChange={setCategory}
            labels={LABELS}
          />
        </div>
      </header>

      <div className="relative mt-2 -mx-6 sm:-mx-10 h-0">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 -top-8 h-64 transition-opacity duration-500 ${hoverPoster ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: hoverPoster
              ? `linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 100%), url(${hoverPoster})`
              : undefined,
            backgroundPosition: "center 40%",
            backgroundSize: "cover",
            filter: "blur(8px)",
          }}
        />
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-3 [&>*]:shrink-0 relative scrollbar scrollbar-hide-until-hover">
        {loading ? (
          <SkeletonCard count={12} width="w-40 sm:w-48" height="aspect-[2/3]" />
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          items.map((it) => (
            <article
              key={it.id}
              className="w-40 sm:w-48"
              onMouseEnter={() => setHoverPoster(it.poster ?? null)}
              onMouseLeave={() => setHoverPoster(null)}
            >
              <div className="relative">
                <div className="aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5 group">
                  {it.poster ? (
                    <>
                      <img
                        src={it.poster}
                        alt={it.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-1 h-20 bg-gradient-to-t from-black to-transparent z-10"
                      />
                      <a
                        href="#"
                        className="absolute inset-0 z-30"
                        aria-label={it.title}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full grid place-items-center text-white/60 text-sm">
                      sem poster
                    </div>
                  )}
                </div>
                <div className="pointer-events-none absolute left-2 -bottom-2 z-40">
                  <RatingRing value={it.vote} size={36} stroke={4} />
                </div>
              </div>

              <h4 className="mt-4 line-clamp-2 text-white/90 text-sm font-bold">
                {it.title}
              </h4>
              <p className="text-white/60 text-xs">
                {it.month} {it.day}, {it.year}
              </p>
            </article>
          ))
        )}

        <div
          aria-hidden
          className="pointer-events-none sticky right-0 self-stretch w-12 z-10 bg-gradient-to-l from-black to-transparent"
        />
      </div>
    </section>
  );
}
