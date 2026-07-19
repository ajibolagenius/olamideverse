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

  clay: {
    solid: "#8C4A1E",
    tint: "#EEE0D3",
    onSolid: "#F4EFE6",
    gradient: ["#8C4A1E", "#5C2F12"],
  },
  navy: {
    solid: "#12193F",
    tint: "#D9DEF2",
    onSolid: "#F4EFE6",
    gradient: ["#12193F", "#090D24"],
  },
} as const;

export type AccentName = keyof typeof ACCENTS;
export const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[];

/**
 * Background + foreground for accent chrome bars (era cards, badges).
 * Oxide's brand solid fails WCAG AA with both paper and ink type — darken
 * the bar to the gradient stop so labels stay readable without changing the
 * brand color used for fills elsewhere.
 */
export function accentChrome(name: AccentName): { bg: string; fg: string } {
  const a = ACCENTS[name];
  if (name === "oxide") {
    return { bg: a.gradient[1], fg: a.onSolid };
  }
  return { bg: a.solid, fg: a.onSolid };
}
