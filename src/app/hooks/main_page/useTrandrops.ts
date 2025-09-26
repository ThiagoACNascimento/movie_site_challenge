const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p"; 

export type TrendingItem = {
  id: number; // id
  title: string; // titulo
  poster: string | null;   // URL pronta (ou null se não tiver)
  vote: number;            // média de votos
  month: string | null;
  day: string | null; // <- pode faltar
  year: string | null; // <- idem
};

export async function getTrending(range: "day" | "week", limit = 20): Promise<TrendingItem[]> { // funcao para resgatar os filmes do dia e da semana, limite 20
  const apiKey = process.env.TMDB_API_KEY; // chave da api

  const res = await fetch(`${TMDB_BASE}/trending/all/${range}?api_key=${apiKey}`, { // funcao para regatar na url do range
    next: { revalidate: 60 * 10 }, // cache 10 min no servidor
  });

  const data = await res.json(); // transform em json

  // ja definindo um tamanho para o poster 
  const posterSize = "w342";

  const items: TrendingItem[] = (data?.results ?? []) // pegando do trendingItens os resultados 
    .slice(0, limit) // somente ate o limite definido
    .map((it: any) => { 
      const title = it.title || it.name || "Untitled"; // pega o titulo ou o nome ou nada
      const poster = it.poster_path ? `${IMAGE_BASE}/${posterSize}${it.poster_path}` : null; // se tiver poster ele adiviona a url do poster
      // filme: release_date | série: first_air_date
      const rawDate: string | null = it.release_date || it.first_air_date || null;

      // Deriva dia/mês/ano em ingles (com fallback seguro)
      let day: string | null = null;
      let month: string | null = null;
      let year: string | null = null;

      if (rawDate) {
        const d = new Date(rawDate);
        if (!Number.isNaN(d.valueOf())) {
          // dia com 2 dígitos
          day = String(d.getDate()).padStart(2, "0");
          // mês por extenso em pt-BR
          month = d.toLocaleDateString("en-Us", { month: "short" });
          // ano com 4 dígitos
          year = String(d.getFullYear());
        }
      }

      return { // retorna o id, o titulo, o poster, a votacao, dia, mes e ano
        id: it.id,
        title,
        poster,
        vote: Number(it.vote_average ?? 0),
        day,
        month,
        year,
      };
    });

  return items;
}
