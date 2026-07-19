import Link from "next/link";
import type { PublishStatus } from "@/lib/admin/types";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-4 border-ink pb-4">
      <div>
        <h1 className="font-display text-3xl uppercase leading-none">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: PublishStatus | string }) {
  const colors: Record<string, string> = {
    published: "bg-palm text-paper",
    draft: "bg-danfo text-ink",
    archived: "bg-ink-soft text-paper",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${colors[status] ?? "bg-white text-ink border border-ink"}`}
    >
      {status}
    </span>
  );
}

export function AdminButton({
  href,
  children,
  variant = "primary",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}) {
  const cls =
    variant === "primary"
      ? "border-2 border-ink bg-danfo text-ink"
      : variant === "danger"
        ? "border-2 border-ink bg-oxide text-paper"
        : "border-2 border-ink bg-white text-ink";
  const className = `inline-flex items-center px-3 py-2 text-[0.75rem] font-bold uppercase tracking-wide ${cls}`;
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <span className={className}>{children}</span>;
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto border-2 border-ink bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b-2 border-ink bg-ink text-paper">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/15">{children}</tbody>
      </table>
    </div>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  hint,
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  hint?: string;
  rows?: number;
}) {
  const shared =
    "w-full border-2 border-ink bg-paper px-3 py-2 text-sm outline-none focus:bg-white";
  return (
    <label className="block space-y-1">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </span>
      {rows ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={shared}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={shared}
        />
      )}
      {hint ? <span className="block text-xs text-ink-soft">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full border-2 border-ink bg-paper px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Flash({
  saved,
  error,
}: {
  saved?: string | string[] | undefined;
  error?: string | string[] | undefined;
}) {
  if (saved) {
    return (
      <p className="mb-4 border-2 border-ink bg-palm px-3 py-2 text-sm font-semibold text-paper">
        Saved.
      </p>
    );
  }
  if (error) {
    return (
      <p className="mb-4 border-2 border-ink bg-oxide px-3 py-2 text-sm font-semibold text-paper">
        Something went wrong ({String(error)}).
      </p>
    );
  }
  return null;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-2 border-dashed border-ink/40 bg-white px-4 py-10 text-center text-sm text-ink-soft">
      {children}
    </div>
  );
}
