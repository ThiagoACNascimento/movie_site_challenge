"use client";

import FooterList from "@/app/ui/footerList";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black to-[#1D1E2C] text-white">
      <nav aria-label="Rodapé">
        <ul className="flex flex-wrap mx-auto justify-center py-20 text-center *:flex *:flex-col *:items-start *:m-5">
          <li className="grid grid-rows-2 gap-y-4 justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <h1 className="text-4xl font-extrabold tracking-widest text-emerald-300 capitalize">
                Cinema
              </h1>
              <span className="h-4 w-10 rounded-full bg-cyan-500 transition-all duration-300 group-hover:w-12" />
            </Link>

            <Link
              href="/"
              className="opacity-90 hover:text-cyan-300 px-4 py-2 rounded-full hover:bg-[#184f74] text-2xl font-serif group transition-all duration-300"
            >
              <span className="block transition-all duration-300 group-hover:text-3xl">
                Log in now
              </span>
            </Link>
          </li>
          <li className="grid grid-rows gap-1">
            <h2 className="font-bold text-lg">The Basics</h2>
            <FooterList name="About TMDB" path="#" />
            <FooterList name="Contact Us" path="#" />
            <FooterList name="Support Forums" path="#" />
            <FooterList name="API Documentation" path="#" />
            <FooterList name="System Status" path="#" />
          </li>
          <li className="grid grid-rows gap-1">
            <h2 className="font-bold text-lg">Get Involved</h2>
            <FooterList name="Contribution Bible" path="#" />
            <FooterList name="Add New Movie" path="#" />
            <FooterList name="Add New TV Show" path="#" />
          </li>
          <li className="grid grid-rows gap-1">
            <h2 className="font-bold text-lg">Community</h2>
            <FooterList name="Guidelines" path="#" />
            <FooterList name="Discussions" path="#" />
            <FooterList name="Leaderboard" path="#" />
          </li>
          <li className="grid grid-rows gap-1">
            <h2 className="font-bold text-lg">Legal</h2>
            <FooterList name="Terms of Use" path="#" />
            <FooterList name="API Terms of Use" path="#" />
            <FooterList name="Privacy Policy" path="#" />
            <FooterList name="MCA Policy" path="#" />
          </li>
        </ul>
      </nav>
    </footer>
  );
}
