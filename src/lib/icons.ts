import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  Books,
  ChatCircle,
  Disc,
  FilmStrip,
  GlobeHemisphereWest,
  Heart,
  Info,
  MapPin,
  MusicNotes,
  Quotes,
  Scales,
  ShareNetwork,
  UsersThree,
  Waveform,
} from "@phosphor-icons/react/ssr";
import { createElement, type ComponentType, type ReactNode } from "react";

/** Default weight for every OV icon — also set via PhosphorProvider. */
export const OV_ICON_WEIGHT = "duotone" as const;

/** Route → icon for nav, doors, and empty states. */
export const NAV_ICONS: Record<string, Icon> = {
  "/eras": Books,
  "/albums": Disc,
  "/media": FilmStrip,
  "/songs": MusicNotes,
  "/snippets": Waveform,
  "/influence": ShareNetwork,
  "/impact": MapPin,
  "/about": Info,
  "/legal": Scales,
  "/fanzone": UsersThree,
  "/legal#takedown": Scales,
};

export function iconForHref(href: string): Icon | null {
  const path = href.split("#")[0] || href;
  return NAV_ICONS[href] ?? NAV_ICONS[path] ?? null;
}

/** Render a nav icon without assigning a component during JSX render. */
export function renderNavIcon(
  href: string,
  props: Omit<IconProps, "weight"> & { className?: string } = {},
): ReactNode {
  const Comp = iconForHref(href);
  if (!Comp) return null;
  return createElement(Comp, {
    weight: OV_ICON_WEIGHT,
    "aria-hidden": true,
    ...props,
  });
}

/** Render any Phosphor icon component safely (avoids dynamic JSX tags). */
export function renderIcon(
  Comp: Icon | ComponentType<IconProps> | null | undefined,
  props: Omit<IconProps, "weight"> & { className?: string; weight?: IconProps["weight"] } = {},
): ReactNode {
  if (!Comp) return null;
  const { weight = OV_ICON_WEIGHT, ...rest } = props;
  return createElement(Comp, {
    weight,
    "aria-hidden": true,
    ...rest,
  });
}

export {
  Books,
  ChatCircle,
  Disc,
  FilmStrip,
  GlobeHemisphereWest,
  Heart,
  Info,
  MapPin,
  MusicNotes,
  Quotes,
  Scales,
  ShareNetwork,
  UsersThree,
  Waveform,
};
