type Props = {
  value: number; // aceita 0–100 ou 0–10
  size?: number; // px
  stroke?: number; // px
};

export default function RatingRing({ value, size = 40, stroke = 4 }: Props) {
  // aceita 0–10 (escala) e 0–100
  const pct = Math.max(0, Math.min(100, value <= 10 ? value * 10 : value));

  // geometria (evita raio negativo/NaN)
  const r = Math.max(1, (size - stroke) / 2);
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  // cores por faixa (baseado no valor 0–10 para a régua)
  const base = value <= 10 ? value : value / 10;
  const color = base >= 7 ? "#22c55e" : base >= 5 ? "#eab308" : "#ef4444";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* chip de fundo ATRÁS */}
      <span
        className="absolute inset-0 rounded-full bg-black/35 pointer-events-none"
        aria-hidden
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block rotate-[-90deg]"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 400ms ease" }}
        />
      </svg>

      {/* label por cima */}
      <span className="absolute rotate-0 text-[11px] font-semibold text-white select-none z-10">
        {base.toFixed(1)}
      </span>
    </div>
  );
}
