"use client";

import Link from "next/link";

type FooterListProps = {
  name: string;
  path: string;
};

export default function FooterList({ name, path }: FooterListProps) {
  return (
    <Link href={path} className="text-sm group relative inline-block">
      <span className="block">{name}</span>
      <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
