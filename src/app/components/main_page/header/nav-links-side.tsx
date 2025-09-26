"use client"; // so para cliente

import * as React from "react";
import Link from "next/link";
import { NavItem } from "./nav-links-top";

export function withLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
} // Funcao que garante que todo link tenha uma /

export function useCloseOnEsc(cb: () => void) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") 
        cb();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cb]);
} // funcao para fechar no ESC

export function MobileAccordion({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false); // abre/fecha mobile
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5"
        aria-expanded={open ? "true" : "false"}
        aria-controls={`section-${item.name}`}
      >
        <h3 className="text-white">{item.name}</h3>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button> {/*tipo botao, quando clica muda o estado para o contrario do atual, comprimento completo, flex, itens no centro, espaco entre eles, padding l e r, padding t e b, redondo, background, leitor, nome e simbolo*/}
      <div
        id={`section-${item.name}`}
        className={`grid transition-[grid-template-rows] duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      > {/*id com o nome, grid, transicao de linhas, duracao, se aberto aparece as linhas, se nao some*/}
        <div className="overflow-hidden"> {/*corta tudo se der overdflow*/}
          <ul className="py-1"> {/*padding*/}
            {item.children?.map((c) => ( // para cada filho dentro dos itens
              <li key={c.name}> {/*faz uma li contendo o link para as paginas*/}
                <Link
                  href={withLeadingSlash(c.href)}
                  className="block px-4 py-2 text-sm text-white/80 rounded hover:bg-white/10 hover:text-cyan-300"
                >{/*block, padding, padding, texto pequeno, cor do texto, redondo, fundo. cor de texto*/}
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="my-2 border-white/10" /> 
      {/*Desenha uma linha horizontal em baixo de cada categoria*/}
    </div>
  );
}
