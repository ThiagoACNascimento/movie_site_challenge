const TMDB_BASE = "https://api.themoviedb.org/3"; // consulta de tudo
const IMAGE_BASE = "https://image.tmdb.org/t/p"; // fornece apenas o path

export type posterItem = { url: string }; // objeto com chave url

export async function getTrendingBackdrops(limit = 12): Promise<posterItem[]> { // funcao async que voltara um valor do tipo posterItem[]
  const apiKey = process.env.TMDB_API_KEY; // valor pra armazenar a chave da api

  const res = await fetch(`${TMDB_BASE}/trending/all/day?api_key=${apiKey}`, { // funcao fetch para buscar oq ta em aula no dia
    next: { revalidate: 60 * 10 }, // faz com que a chamada nao seja feita toda hora, mas a cada 10 minutos
  });

  if (!res.ok) throw new Error("Falha ao buscar trending da TMDB"); // verificacao simples para ver se deu certo

  const data = await res.json(); // converte a resposta da api para json
  const items = (data?.results ?? []) //pega o campo da resposta do data e se nao tiver usa []
    .map((it: any) => it.poster_path) // pega apenas o campo backdrop_path (imagem)
    .filter(Boolean) // remove filmes que nao possuem
    .slice(0, limit) // limita para o numero de imagens definidas
    .map((path: string) => ({ url: `${IMAGE_BASE}/w1280${path}` })); // monta a url final da imagem  e transforma em um obj url

    return items; //retorna os itens
}
