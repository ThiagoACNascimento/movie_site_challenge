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
      <div className="md:hidden bg-[#1D1E2C] text-white">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-start">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded hover:bg-white/10"
            aria-label="Abrir menu"
          >
            <div className="w-6 h-[2px] bg-white mb-1" />
            <div className="w-6 h-[2px] bg-white mb-1" />{" "}
            {/*desenho das barras*/}
            <div className="w-6 h-[2px] bg-white" />
          </button>
          <Link
            href="/"
            className="ml-2 text-lg font-extrabold tracking-widest text-emerald-300"
          >
            Cinema
          </Link>
        </div>
      </div>

      {/* overlay (clica pra fechar) */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} md:hidden`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* drawer lateral */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-72 bg-[#1D1E2C] border-r border-white/10
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden z-50
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* topo do drawer */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Link
            href="/"
            ref={firstLinkRef}
            className="text-lg font-extrabold tracking-widest text-emerald-300"
          >
            Cinema
          </Link>{" "}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded hover:bg-white/10"
            aria-label="Fechar menu"
          >
            ✕
          </button>{" "}
        </div>
        {/* conteúdo da sidebar */}
        <div className="p-4 space-y-2 text-white">
          {links_left.map((item) => (
            <MobileAccordion key={item.name} item={item} />
          ))}

          <div className="pt-2">
            <h3 className="px-3 pb-1 text-xs uppercase tracking-wider text-white/60">
              Conta
            </h3>
            <ul className="space-y-1">
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
