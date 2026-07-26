#!/usr/bin/env node
/**
 * Applies supabase/migrations/*_site_analytics.sql via the Supabase
 * Management API. Requires SUPABASE_ACCESS_TOKEN (supabase login / PAT)
 * and a linked project (supabase/.temp/linked-project.json).
 *
 * Usage: node --env-file=.env.local scripts/apply-analytics-migration.mjs
 * Or:    supabase db push
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const linked = JSON.parse(
  readFileSync(join(root, "supabase/.temp/linked-project.json"), "utf8"),
);
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN. Run `supabase login` or set the env var, then retry.\nAlternatively: `supabase db push`",
  );
  process.exit(1);
}

const migration = readFileSync(
  join(root, "supabase/migrations/20260726205553_site_analytics.sql"),
  "utf8",
);

const res = await fetch(
  `https://api.supabase.com/v1/projects/${linked.ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: migration }),
  },
);

const text = await res.text();
if (!res.ok) {
  console.error("Migration failed:", res.status, text);
  process.exit(1);
}
console.log("Applied site_analytics migration.", text.slice(0, 200));
