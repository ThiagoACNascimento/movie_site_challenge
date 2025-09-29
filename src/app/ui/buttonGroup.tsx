"use client";

import React from "react";

type ButtonGroupProps<T extends string> = {
  options: T[]; // Valores possíveis para a busca (ex: "day", "week") como no primeiro botao
  selected: T; // Qual está selecionado pelo usuario
  onChange: (value: T) => void; // Mudanca de valor ao clicar
  labels?: Partial<Record<T, string>>; // Nome dos botoes
};

export default function ButtonGroup<T extends string>({
  options,
  selected,
  onChange,
  labels = {},
}: ButtonGroupProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Botões de filtro"
      className="inline-flex rounded-full bg-stone-800 p-1 ring-1 ring-white/10 z-1"
    >
      {options.map((option) => (
        <button
          key={option}
          role="tab"
          aria-selected={selected === option}
          onClick={() => onChange(option)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            focus-visible:ring-blue-400 focus-visible:ring-offset-stone-900
            ${
              selected === option
                ? "bg-blue-600 text-white"
                : "text-white/75 hover:text-white"
            }
          `}
        >
          {labels[option] ?? option}
        </button>
      ))}
    </div>
  );
}
