#!/usr/bin/env node
/**
 * Stamps public/sw.js with a build-unique VERSION before every production
 * build. Browsers only install a new service worker when its bytes change,
 * so without this, a deploy that doesn't touch sw.js would never trigger the
 * `controllerchange` that AppUpdateNotice listens for.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const swPath = fileURLToPath(new URL("../public/sw.js", import.meta.url));

function resolveVersion() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 10);
  }
  try {
    return execSync("git rev-parse --short=10 HEAD", { encoding: "utf8" }).trim();
  } catch {
    return String(Date.now());
  }
}

const version = resolveVersion();
const source = readFileSync(swPath, "utf8");
const versionLine = /^const VERSION = ".*";$/m;

if (!versionLine.test(source)) {
  throw new Error("stamp-sw-version: could not find `const VERSION = \"...\";` in public/sw.js");
}

const stamped = source.replace(versionLine, `const VERSION = "${version}";`);
writeFileSync(swPath, stamped);
console.log(`stamp-sw-version: public/sw.js -> ${version}`);
