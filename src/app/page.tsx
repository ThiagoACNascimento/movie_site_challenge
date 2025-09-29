// app/page.tsx
import Hero from "./components/main_page/background/BackgroundRotator";
import Popular from "./components/main_page/popular/popular";
import TrailerSection from "./components/main_page/trailer/trailersection";
import TrendingSection from "./components/main_page/trending/trendingsection";

export default function Home() {
  return (
    <div className="bg-black min-h-screen h-600">
      {/*Fundo e mensagem inicial*/}
      <Hero />
      <main className="grid gap-25">
        {/*Secao de filmes da semana e do dia*/}
        <TrendingSection />

        {/* Secao de trailers */}
        <TrailerSection />

        {/*  */}
        <Popular />
      </main>
    </div>
  );
}
