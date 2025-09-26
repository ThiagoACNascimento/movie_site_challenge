// app/page.tsx
import Hero from "./components/main_page/background/BackgroundRotator";
import TrendingSection from "./components/main_page/trending/trendingsection";

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <main className="grid gap-10">
        {/*Fundo e mensagem inicial*/}
        <Hero />

        {/*Secao de filmes da semana e do dia*/}
        <TrendingSection />

        {/* Secao de trailers */}
        

      </main>
    </div>
  );
}
