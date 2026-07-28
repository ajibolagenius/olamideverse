import type { HTMLAttributes } from "react";

interface AdirePatternProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number;
  color?: string;
}

/**
 * AdirePattern — subtle Yoruba resist-dye vector motif background.
 * Adds texture to dark sections (adire, ink) while maintaining readability and WCAG AA contrast.
 */
export default function AdirePattern({
  opacity = 0.07,
  color = "#F4EFE6",
  className = "",
  ...props
}: AdirePatternProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      {...props}
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="adire-grid-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke={color} strokeWidth="1" opacity={opacity}>
              {/* Outer diamond */}
              <path d="M24 0 L48 24 L24 48 L0 24 Z" />
              {/* Inner diamond */}
              <path d="M24 10 L38 24 L24 38 L10 24 Z" />
              {/* Center Yoruba adire dot */}
              <circle cx="24" cy="24" r="3" fill={color} />
              {/* Corner accent stars */}
              <path d="M0 0 L6 6 M48 0 L42 6 M0 48 L6 42 M48 48 L42 42" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adire-grid-pattern)" />
      </svg>
    </div>
  );
}
