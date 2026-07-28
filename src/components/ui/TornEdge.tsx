interface TornEdgeProps {
  position?: "top" | "bottom";
  fill?: string;
  className?: string;
}

/**
 * TornEdge — vector torn-paper edge section divider.
 * Creates the authentic paste-up poster aesthetic when transitioning between dark ink poster sections and warm paper body measures.
 */
export default function TornEdge({
  position = "bottom",
  fill = "#181410",
  className = "",
}: TornEdgeProps) {
  const isTop = position === "top";

  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 z-10 w-full overflow-hidden leading-none ${
        isTop ? "top-0 -translate-y-full rotate-180" : "bottom-0 translate-y-full"
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className="block h-3 w-full sm:h-4"
        viewBox="0 0 1200 16"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 L30,10 L60,3 L90,13 L120,5 L150,11 L180,2 L210,14 L240,4 L270,12 L300,3 L330,13 L360,5 L390,10 L420,2 L450,14 L480,4 L510,12 L540,3 L570,13 L600,5 L630,11 L660,2 L690,14 L720,4 L750,12 L780,3 L810,13 L840,5 L870,10 L900,2 L930,14 L960,4 L990,12 L1020,3 L1050,13 L1080,5 L1110,11 L1140,2 L1170,14 L1200,0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
