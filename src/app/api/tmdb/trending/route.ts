// src/app/api/tmdb/trending/route.ts
import { getTrending } from "@/app/hooks/main_page/useTrandrops";

export async function GET(req: Request) { // funcao get para pegar os valores
    const url = new URL(req.url); // ria uma url apartir da req
    const rangeParam = url.searchParams.get("range"); // pega o dia ou semana
    const limitParam = url.searchParams.get("limit"); // pega o limite

    const range = rangeParam === "week" ? "week" : "day"; // default: day
    const limit = Math.max(1, Math.min(50, Number(limitParam ?? 20))); // pega o minimo entre o valor dele e 50 e o valor maximo entre 1 e o minimo 

    const items = await getTrending(range, limit); // chava a funcao com os range e o limite
    return Response.json({ items }); // retorna os itens
}
