"use client";

export type ChipOption = { value: string; label: string };

export default function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`border-2 border-ink px-2.5 py-1.5 text-[0.72rem] font-bold tracking-[0.04em] uppercase transition-colors ${
              active ? "bg-ink text-paper" : "bg-white text-ink hover:bg-paper-dim"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
