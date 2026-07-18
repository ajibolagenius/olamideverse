/**
 * Era accent assignments (docs/VISUAL-IDENTITY.md §2: "each era gets an accent
 * assignment from this palette, plus tints, so chapters feel distinct while
 * staying in one family").
 *
 * `gradient` pairs drive the placeholder album covers and media thumbnails
 * until real, licensed artwork is sourced in the Phase 2 content pass.
 */
export const ACCENTS = {
  danfo: {
    solid: "#F5B301",
    tint: "#FBE29A",
    onSolid: "#181410",
    gradient: ["#F5B301", "#8A6400"],
  },
  adire: {
    solid: "#1F2A63",
    tint: "#D9DEF2",
    onSolid: "#F4EFE6",
    gradient: ["#1F2A63", "#101736"],
  },
  oxide: {
    solid: "#C8451B",
    tint: "#F2D3C5",
    onSolid: "#F4EFE6",
    gradient: ["#C8451B", "#7A2508"],
  },
  palm: {
    solid: "#2F5233",
    tint: "#D3E0D5",
    onSolid: "#F4EFE6",
    gradient: ["#2F5233", "#17301B"],
  },
  ink: {
    solid: "#181410",
    tint: "#E9E2D3",
    onSolid: "#F4EFE6",
    gradient: ["#3A332B", "#181410"],
  },
} as const;

export type AccentName = keyof typeof ACCENTS;
export const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[];
