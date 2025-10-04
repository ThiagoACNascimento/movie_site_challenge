"use client";

import { useEffect, useState } from "react";
import RatingRing from "@/app/ui/rating-ring";
import ButtonGroup from "@/app/ui/buttonGroup";
import SkeletonCard from "@/app/ui/skeletonPoster";
import Image from "next/image";
import Link from "next/link";

type Range = "day" | "week";

type TrendingItem = {
  id: number;
  title: string;
  poster: string | null;
  vote: number; // 0–100
  year: number | null;
  month: string | null;
  day: number | null;
};

export default function TrendingSection() {
  const [range, setRange] = useState<Range>("day");
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverPoster, setHoverPoster] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/tmdb/trending?range=${range}&limit=20`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

        const data: { ok: boolean; items: TrendingItem[]; error?: string } =
          await res.json();

        if (!data.ok) throw new Error(data.error || "Falha na API");

        if (alive) setItems(data.items ?? []);
      } catch (err: any) {
        console.error("[Trending API Error]", err);
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [range]);

  return (
    <section className="max-w-7xl mx-auto w-full px-6 sm:px-10">
      <header className="flex items-center justify-between gap-6">
        <h3 className="text-white text-2xl font-semibold z-1">Trending</h3>

        <div
          role="tablist"
          aria-label="Trending range"
          className="inline-flex rounded-full bg-stone-800 p-1 ring-1 ring-white/10"
        >
          <ButtonGroup
            options={["day", "week"]}
            selected={range}
            onChange={setRange}
            labels={{ day: "Today", week: "This week" }}
          />
        </div>
      </header>

      {/*background no houver*/}
      <div className="relative mt-2 -mx-6 sm:-mx-10 h-0">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 -top-8 h-64 transition-opacity duration-500${
            hoverPoster ? "opacity-100" : "opacity-0"
          }`}
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

      {/*Lista*/}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-3 [&>*]:shrink-0 relative scrollbar scrollbar-hide-until-hover">
        {loading ? (
          <SkeletonCard count={10} width="w-40 sm:w-48" height="aspect-[2/3]" />
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
                      <Image
                        src={it.poster}
                        alt={it.title}
                        width={500}
                        height={750}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-1 h-20 bg-gradient-to-t from-black to-transparent z-10"
                      />
                      <Link
                        href={`/pages/info/${it.id}`}
                        className="absolute inset-0 z-30"
                        aria-label={it.title}
                      ></Link>
                      <a />
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
