"use client"; // so para cliente

import Link from "next/link";
import * as React from "react";

export type ChildLink = { name: string; href: string }; // Define filho do link tendo nome e link
export type NavItem = { 
  name: string;          
  children?: ChildLink[];  // submenu
}; // Define a navegacao dos links_left (nome e sublinks_left)

export const links_left: NavItem[] = [
  {
    name: "Movies",
    children: [
      { name: "Popular", href: "movies/popular" },
      { name: "Now Playing", href: "movies/now-playing" },
      { name: "Upcoming", href: "movies/upcoming" },
      { name: "Top Rated", href: "movies/top-rated" },
    ],
  },
  {
    name: "TV Shows",
    children: [
      { name: "Popular", href: "tv/popular" },
      { name: "Airing Today", href: "tv/airing-today" },
      { name: "On the Air", href: "tv/on-the-air" },
      { name: "Top Rated", href: "tv/top-rated" },
    ],
  },
  {
    name: "People",
    children: [{ name: "Popular", href: "person" }],
  },
  {
    name: "More",
    children: [
      { name: "Discussions", href: "discuss" },
      { name: "Leaderboard", href: "more/leaderboard" },
      { name: "Talk", href: "more/talk" },
    ],
  },
]; // Define os links_left e seus sublinks_left

function withLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
} // Funcao que garante que todo link tenha uma /

function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) { // Funcao mostrar link ao passar o mouse. Recebe link e filho
  return (
    <Link
      href={withLeadingSlash(href)} // link
      role="menuitem" // leitor de tela
      className="block w-full rounded-lg px-3 py-2 text-sm text-white/90 hover:text-cyan-300 hover:bg-white/5 focus:bg-white/10"
      // bloco, comprimento cheio, arredondado, pedding em l e r, pedding em u e b, tamanho do texto, cor do texto, cor do texto ao passar o mouse, cor do fundo ao passar mouse, muda de cor ao foco
    >
      {children} {/* mostra o children do link*/}
    </Link>
  );
}

export function Navlinks_left() { // funcao que mostra os links_left e seus sublinks_left
  return (
    <nav className="hidden md:block"> {/*escondido, se maior que 768px: mostra*/}
      <ul className="flex items-center gap-2 font-bold"> {/*flex, items no centro, gap de 24px, tamanho do texto*/}
        {links_left.map((item) => { // para cada item no mapa de links_left
          return (
            <li
              key={item.name}
              className="relative group after:content-[''] after:absolute after:left-0 after:top-full after:h-2 after:w-full"
            >{/*relativo, lider do grupo, cria um pseudo-elemento vazio, o pseudo-elemento sera absoluto em relacao ao pai, encosta na borda esquerda, comeca logo abaixo do pai, possui altura de 8px, comprimento igual ao pai*/}
              
              {/* botao */}
              <button
                type="button"
                className="opacity-90 hover:text-cyan-300 p-3 rounded-full hover:bg-[#184f74]"
                aria-haspopup="true"
                aria-expanded="false"
              > {/*tipo botao, opacidade 90%, muda a cor do texto com o mouse em cima, padding de 12px, forma arredondada, muda o fundo ao passar o mouse em cima*/}
                {item.name} {/*mostra o nome do item*/}
              </button>

              {/* Funcao Dropdown */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100
                absolute left-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0A3048] shadow-lg transition-opacity duration-150 z-50"
                role="menu"
                aria-label={`${item.name} submenu`}
              > {/*invisivel, opacidade:0, se passar o mouse em cima do pai: visivel, mesma coisa para opacidade 100, visivel se focado, opacidade 100 se focado, absoluto em relacao ao pai, abaixo do  pai, margem top 8px, arredondado, borda, borda branca com opacidade de 10%, background, sombra, transicao suave na opacidade, duracao de 150ms, elemento acima dos outros*/}
                <div className="p-2"> {/*padding de 8px*/}
                  {item.children!.map((child) => ( // passa por cada child do item
                    <DropdownLink key={child.name} href={child.href}> {/*chama o dropdownlink e manda o nome e o href de cada link*/}
                      {child.name} {/*mostra o nome de cada um*/}
                    </DropdownLink>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

export const link_right = [
  { name: "Login", href: "/login" },
  { name: "Enter the cinema", href: "/signup" },
]; // links da direita

export function Navlinks_right() {
  return (
    <nav className="hidden md:block"> {/*escondido em mobile*/}
      <ul className="flex items-center gap-6 font-bold">
        {link_right.map((item) => {
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className="opacity-90 hover:text-cyan-300 p-3 rounded-full hover:bg-[#184f74]"
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
