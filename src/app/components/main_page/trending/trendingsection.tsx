"use client";

import { useEffect, useState } from "react";
import type { TrendingItem } from "@/app/hooks/main_page/useTrandrops";
import RatingRing from "@/app/ui/rating-ring";

type Range = "day" | "week"; // objeto tipo range podendo ser dia ou semana

export default function TrendingSection() { // funcao 
  const [range, setRange] = useState<Range>("day"); // estado com dia selecionado 
  const [items, setItems] = useState<TrendingItem[]>([]); // estado para a lista de itens
  const [loading, setLoading] = useState(true); // carregamento, mostra o esqueleto e pulso

  useEffect(() => { // efeito para buscar quando range muda
    let alive = true; // tag para evitar setState depois de desmontamento
    (async () => {
      setLoading(true); // seta loading para true
      try {
        const res = await fetch(`/api/tmdb/trending?range=${range}&limit=20`, { cache: "no-store" }); // faz fetch buscando o range (dia ou semana)
        const data = await res.json(); // muda para tipo json
        if (alive) 
          setItems(data.items ?? []);// se tiver vivo atualiza items
      } finally {
        if (alive) 
          setLoading(false); // se tiver vivo ainda seta loading para falso
      }
    })();
    return () => { alive = false; }; // desmonta
  }, [range]);

  return (
    <section className="max-w-7xl mx-auto w-full px-6 sm:px-10">{/*maximo w, margin auto, w cheio, padding, se paior que algo padding*/}
      <header className="flex items-center justify-between gap-6">{/*flex itens no centro, justifica, gap*/}
        <h3 className="text-white text-2xl font-semibold">Trending</h3> {/*texto branco, tamanho do texto, fonte*/}

        {/*botoes*/}
        <div role="tablist" aria-label="Trending range" // leitor de telas 
             className="inline-flex rounded-full bg-stone-800 p-1 ring-1 ring-white/10"> {/*inline-flex, redondo, cor de fundo, padding, anel em volta, cor do anel*/}
=
          <button
            role="tab" // leitor de tela
            aria-selected={range === "day"}// marca como dia (leitor)
            onClick={() => setRange("day")} // quando clicado seta para dia
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-stone-900
            ${range === "day" ? "bg-blue-600 text-white" : "text-white/75 hover:text-white"}`} // padding, padding, redondo, tamanho do texto, fonte
            // transicao, duracao, aplicacao de anel quando focado, cor do foco, se o range e dia, muda a cor e o texto, se nao tbm muda
          >
            Today
          </button>
          <button
            role="tab"
            aria-selected={range === "week"}
            onClick={() => setRange("week")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-stone-900
            ${range === "week" ? "bg-blue-600 text-white" : "text-white/75 hover:text-white"}`}
            // mesma coisa que o dia
          >
            This week
          </button>
        </div>
      </header>

      {/* div da lista */}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-3 [&>*]:shrink-0 relative">
        {loading
        ? [...Array(10)].map((_, i) => (
            <div key={i} className="w-40 sm:w-48 aspect-[2/3] rounded-xl bg-white/10 animate-pulse" />
          ))
        : items.map((it) => (
            <article key={it.id} className="w-40 sm:w-48">
              
              <div className="relative">
                
                <div className="aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5 group">{/*controla proporcao entre altura e largura, esconde conteudo ao passar de um cert w e h, redondo, anel, cor do anel*/}
                  {it.poster ? (
                    <>
                      <img
                        src={it.poster}
                        alt={it.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      /> {/*imagem, toda altura, toda w, nao repete, transicao quando coloca mouse em cima*/}

                      {/* gradiente de leitura para dar um efeito*/}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-1 h-20 bg-gradient-to-t from-black to-transparent z-10"
                      />

                      {/* link clicável no card */}
                      <a href="#" className="absolute inset-0 z-30" aria-label={it.title} />
                    </>
                  ) : (
                    <div className="h-full w-full grid place-items-center text-white/60 text-sm">
                      sem poster
                    </div>
                  )}
                </div>

                {/* anel de nota*/}
                <div className="pointer-events-none absolute left-2 -bottom-2 z-40">
                  <RatingRing value={it.vote} size={36} stroke={4} />
                </div>
              </div>

              {/*titulo e datas*/}
              <h4 className="mt-4 line-clamp-2 text-white/90 text-sm font-bold">{it.title}</h4>
              <p className="text-white/60 text-xs">{it.month} {it.day}, {it.year}</p>
            </article>
            
        ))}
        {/* efito na lateral de gradiente */}
         <div
          aria-hidden
          className="pointer-events-none sticky right-0 self-stretch w-12 z-10 bg-gradient-to-l from-black to-transparent"
          />
      </div>
    </section>
  );
}