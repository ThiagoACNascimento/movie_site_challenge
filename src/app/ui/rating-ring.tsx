type Props = {
  value: number;      // valor 
  size?: number;      // tamanho
  stroke?: number;    // tamanho do anel em volta
};

// funcao que retorna o anel com base no valor, tamanho e stroke
export default function RatingRing({value, size, stroke}: Props) {
  // clamp e % (0..100)
  const pct = Math.max(0, Math.min(100, (value ?? 0) * 10));

  // geometria do círculo
  const r = (size - stroke) / 2;           // raio visível
  const c = 2 * Math.PI * r;               // circunf.
  const offset = c * (1 - pct / 100);      // quanto falta pra completar

  // cor por faixa
  const color =
    value >= 7 ? "#22c55e" : value >= 5 ? "#eab308" : "#ef4444"; // verde / amarelo / vermelho

  return (
    <div
      className={`relative flex items-center justify-center`} // relativo, flex, itens no centro e justifica no centro
      style={{ width: size, height: size }} // tamanhos
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block rotate-[-90deg]" // bloco e comeca no eixo do tpo
      > {/*Sera um svg*/}
        {/* dois circulos, um que sera o circulo padrao e o de progresso*/}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke} 
        />
        {/* progresso */}
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
          // centro do circulo, raio, disco nao solido, cor, espessura, arredondada, comprimento, quanto ele ta preenchido, animacao de preenchimento
        />
      </svg>

      {/* label central */}
      <span className="absolute rotate-0 text-[11px] font-semibold text-white">
        {value.toFixed(1)}
      </span>

      {/* fundo “chip” sutil */}
      <span className="absolute inset-0 rounded-full bg-black/35" />
    </div>
  );
}
