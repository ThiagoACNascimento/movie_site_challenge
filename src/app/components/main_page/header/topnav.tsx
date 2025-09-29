"use client"; // so para cliente

import Link from "next/link";
import { Navlinks_left, Navlinks_right } from "./nav-links-top";

export default function Topbar() {
  return (
    <header className="bg-[#1D1E2C] text-white bg-gradient-to-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 group">
              <h1 className="text-2xl font-extrabold tracking-widest text-emerald-300 capitalize">
                Cinema
              </h1>
              <span className="h-4 w-10 rounded-full bg-cyan-500 transition-all group-hover:w-12" />
            </Link>
          </div>

          {/* Parte da direita do header */}
          <div className="flex items-center gap-2">
            <Navlinks_right />
          </div>
        </div>
      </div>
    </header>
  );
}
