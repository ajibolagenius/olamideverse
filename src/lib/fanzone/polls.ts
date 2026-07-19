/**
 * Poll definitions — question/options/seed counts stay static in the app
 * (matching the design's POLL_DEFS), only real votes live in Supabase.
 * `base` seeds the count so results aren't zero on launch.
 */
export type PollDef = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  base: Record<string, number>;
};

export const POLL_DEFS: PollDef[] = [
  {
    id: "poll-elder-statesman",
    question: "Elder Statesman highlight?",
    options: [
      { id: "uy-scuti", label: "UY Scuti (2021)" },
      { id: "unruly", label: "Unruly (2023)" },
    ],
    base: { "uy-scuti": 166, unruly: 195 },
  },
];
