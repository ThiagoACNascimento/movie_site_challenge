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
      if (e.key === "Escape") cb();
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
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>{" "}
      <div
        id={`section-${item.name}`}
        className={`grid transition-[grid-template-rows] duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          {" "}
          <ul className="py-1">
            {" "}
            {/*padding*/}
            {item.children?.map((c) => (
              <li key={c.name}>
                {" "}
                <Link
                  href={withLeadingSlash(c.href)}
                  className="block px-4 py-2 text-sm text-white/80 rounded hover:bg-white/10 hover:text-cyan-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="my-2 border-white/10" />
    </div>
  );
}
