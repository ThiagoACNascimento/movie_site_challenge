"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResp = { images: { url: string }[] }; // cria um objeto que vai armazenar as imagens

export default function Hero() {
  const [imgs, setImgs] = useState<string[]>([]); // imgs que vao guardar o array das urls
  const [idx, setIdx] = useState(0); // idx indice da imagem atual dentro das imgs

  // busca uma vez na montagem
  useEffect(() => {
    let mounted = true; // flag que evita setState caso componente ja for desmontado
    (async () => {
      const res = await fetch("/api/tmdb/posterItem", { cache: "no-store" }); // chama a api interna e desabilita o cache do cliente
      const data: ApiResp = await res.json(); // transforma a resposta em obj json
      if (mounted) 
        setImgs(data.images?.map(i => i.url) ?? []); // extrai so as URLS e salva o estado
    })();
    return () => { mounted = false; }; // limpa ao desmontar
  }, []);

  // troca a cada 6s (sem animação)
  useEffect(() => {
    if (imgs.length <= 1) // volta se tiver 1 ou menos imagens
      return;
    const id = setInterval(() => setIdx(i => (i + 1) % imgs.length), 15000); // avanca o index cicularmente
    return () => clearInterval(id); // quando imagem muda o componente desmonta
  }, [imgs]);

  // pré-carrega a próxima (evita “flash” em conexões lentas)
  const nextUrl = useMemo(() => {
    if (imgs.length < 2) 
        return null; // se tiver menos que 2 poster
    const n = (idx + 1) % imgs.length; // calcula a proxima de forma rotacional
    return imgs[n]; // volta a proxima
  }, [imgs, idx]);

  useEffect(() => {
    if (!nextUrl) // se nao tiver proxima, volta 
      return;
    const img = new Image(); // cria a proxima
    img.src = nextUrl;
  }, [nextUrl]);

  const current = imgs[idx]; // url atual

  return (
    <section className="relative h-90 hidden md:block">{/*relativo para filhos serem absolutos, tamanho, esconido, bloco se tiver com um tamanho maior*/}
      
      
      {imgs.map((url, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-3000 ease-in-out"
          style={{
            backgroundImage: `url(${url})`,
            backgroundPosition: "center 44%",
            opacity: i === idx ? 1 : 0,
          }}
        />
      ))}{/*absoluto inset-0 e bg no centrom transicao de opacidade duracao de 1s e suavidade*/}

      {/* div para colocar um gradiante absoluto, inset-0, gradiante em b de for via e to */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#1D1E2C]/80 via-black/60 to-black"
      /> 


      {/* Conteúdo */}
      <div className="relative z-20 flex h-full items-center justify-center text-center font-serif px-5 sm:px-6">
        <div className="space-y-4">
          <h1 className="text-white text-5xl sm:text-6xl font-extrabold tracking-tight">
            Welcome.
          </h1>
          <h2 className="text-white/95 text-2xl sm:text-3xl font-semibold max-w-4xl mx-auto">
            Millions of movies, TV shows and people to discover. Explore now.
          </h2>
        </div>
      </div> {/*relativo, em cima do background, flex pega toda o tamanho, itens no centro, justifica centro, texto no centro, fonte, padding, espaco entre eles no y, texto branco, tamanho do texto, font, espaco entre as letras, cor do texto, tamanho, font, tamanho margin auto*/}
    </section>
  );
}
