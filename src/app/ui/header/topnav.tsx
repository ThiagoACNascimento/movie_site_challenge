"use client"; // so para cliente

import Link from "next/link";
import { Navlinks_left, Navlinks_right } from "./nav-links-top";

export default function Topbar() {
  return (
    <header className="bg-[#06253A] text-white"> {/*cor do background, texto branco*/}
      <div className="mx-auto max-w-7xl px-4 sm:px-6"> {/* Deixa no meio, tamanho do espacamento, padding u e b em 4,  px-6 se tela >= 640px*/}
        <div className="flex h-20 items-center justify-between">{/*display flex (lado a lado), autura 80px, alinha no centro e espaco entre eles*/}
          
          {/* Parte da esquerda do header */}
          <div className="flex items-center gap-4"> {/*display flex (lado a lado), alinha no centro e gap de 32px*/}
            <Link href="/" className="flex items-center gap-1 group"> {/*display flex (lado a lado), alinha no centro, gap de 8px, agrupa para mudar algo*/}
              <h1 className="text-2xl font-extrabold tracking-widest text-emerald-300 capitalize"> {/*tamanho do texto, fonte, espacamento entre letras, cor, primeiras letras maiusculas*/}
                Cinema
              </h1>
              <span className="h-4 w-10 rounded-full bg-cyan-500 transition-all group-hover:w-12" />{/*autura, comprimento, arrendondado, cor, transicao suave, comprimento aumenta ao encostar no link*/}
            </Link>

            <Navlinks_left/> {/*chama funcao*/}
          </div>

          {/* Parte da direita do header */}
          <div className="flex items-center gap-2">
            <Navlinks_right/>
          </div>
        </div>
      </div>
    </header>
  );
}
