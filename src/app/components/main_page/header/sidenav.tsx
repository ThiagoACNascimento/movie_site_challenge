"use client"; // so para cliente

import * as React from "react";
import Link from "next/link";
import { link_right, links_left } from "./nav-links-top";
import { MobileAccordion, useCloseOnEsc } from "./nav-links-side";

export default function Sidebar() {
  const [open, setOpen] = React.useState(false); // estado do drawer mobile
  const firstLinkRef = React.useRef<HTMLAnchorElement | null>(null); // foco inicial

  useCloseOnEsc(() => setOpen(false)); // fecha com ESC

  // foca primeiro link ao abrir
  React.useEffect(() => {
    if (open) setTimeout(() => firstLinkRef.current?.focus(), 0);
  }, [open]);

  return (
    <>
      {/* botão de barras (só no mobile) */}
      <div className="md:hidden bg-[#1D1E2C] text-white">{/*maior que 768px: fica escondido, background, texto branco*/}
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-start"> {/*margin t e b auto, max comprimento, padding de 16px, maior que 640px aplica padding 24px, altura 56px, flex, itens no centro, espaco entre eles*/}
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded hover:bg-white/10"
            aria-label="Abrir menu"
          > {/*se clicar ele abre, padding, arredondado, cor do background se passar o mouse em cima, nome com tab*/}
            <div className="w-6 h-[2px] bg-white mb-1" />
            <div className="w-6 h-[2px] bg-white mb-1" /> {/*desenho das barras*/}
            <div className="w-6 h-[2px] bg-white" />
          </button>
          <Link href="/" className="ml-2 text-lg font-extrabold tracking-widest text-emerald-300"> {/*tamanho do texto, fonte, espaco entre as letras, cor do texto*/}
            Cinema
          </Link>
        </div>
      </div>

      {/* overlay (clica pra fechar) */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} md:hidden`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        // cobre a tela toda, background, transicao na opacidade, duracao, pergunta se ta aberto, se sim opacidade 100 e habilita clicar, se nao opacidade 0 e desabilita clicar, quando clica fecha, esconde do leitor de tela
      />

      {/* drawer lateral */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-72 bg-[#1D1E2C] border-r border-white/10
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden z-50
        `}
        role="dialog" aria-modal="true" aria-label="Menu"
      > {/*fixo do topo ao rodape, grudado na esquerda, tamanho da largura, cor do fundo, borda, cor da borda, transicao de tranformacao, duracao, se aberto transicao de x para 0 se fechado de x para completo, leitor de tela*/}
        {/* topo do drawer */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Link
            href="/"
            ref={firstLinkRef}
            className="text-lg font-extrabold tracking-widest text-emerald-300"
          >
            Cinema
          </Link> {/*flex, itens no centro, espaco entre eles, padding t e b, padding l e r, borda, cor da borda, link, leitor no foco do link, tamanho do texto, fonte, espaco entre letras, cor do texto*/}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded hover:bg-white/10"
            aria-label="Fechar menu"
          >
            ✕
          </button> {/*clicar no x fecha, padding, redondo, leitor*/}
        </div>

        {/* conteúdo da sidebar */}
        <div className="p-4 space-y-2 text-white"> {/*padding espaco entre eles, texto branco */}
          {links_left.map((item) => (
            <MobileAccordion key={item.name} item={item} />
          ))} {/*Para cada item faz a funcao*/}

          <div className="pt-2"> {/*padding*/}
            <h3 className="px-3 pb-1 text-xs uppercase tracking-wider text-white/60">Conta</h3> {/*padding l e r, padding t e b, tamanho text, letra maiuscula, espacamento entre letras, cor do texto*/}
            <ul className="space-y-1">{/*espacamento entre eles*/}
              {link_right.map((r) => (
                <li key={r.name}>
                  <Link
                    href={r.href}
                    className="block px-3 py-2 rounded hover:bg-white/10 text-white/90"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
