import type { IconProps } from "@phosphor-icons/react";
import { Tray } from "@phosphor-icons/react/ssr";
import type { ComponentType } from "react";
import { renderIcon } from "@/lib/icons";

export default function EmptyState({
  message = "No items yet — check back as the archive grows.",
  icon = Tray,
}: {
  message?: string;
  icon?: ComponentType<IconProps>;
}) {
  return (
    <div className="border-2 border-dashed border-ink-soft p-8 text-center text-sm text-ink-soft">
      {renderIcon(icon, {
        className: "ov-icon mx-auto mb-3 text-ink-soft",
        size: 32,
      })}
      <p>{message}</p>
    </div>
  );
}
