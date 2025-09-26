// app/api/tmdb/backdrops/route.ts
import { getTrendingBackdrops } from "@/app/hooks/main_page/usePosterItem";

export async function GET() { // funcao com o tipo de metodo http
    const images = await getTrendingBackdrops(12); // pega as urls e guarda em uma variavel imagem que vai ter todas as urls
    return Response.json({ images }); // retorna as imagens no formato json
}
