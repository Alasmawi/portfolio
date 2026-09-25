#!/usr/bin/env bash
# Assemble the deployable tree:
#
#   dist/            the site, built from this checkout                -> /
#   dist/v1/         the original site, from the committed legacy-v1/  -> /v1
#
# Deliberately free of git. An earlier version built the original from a git
# worktree of another branch and failed in CI with exit 128, because a deploy
# checkout is shallow, carries only the deployed branch, and need not hold
# credentials to fetch more. The original is a site that will never change
# again, so it is built once by scripts/snapshot-v1.sh and committed; this
# script only copies files.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -f "legacy-v1/index.html" ]; then
  echo "error: legacy-v1/index.html is missing — nothing to serve at /v1." >&2
  echo "       Regenerate it with: bash scripts/snapshot-v1.sh" >&2
  exit 1
fi

echo "==> Building the site -> dist/"
# Vite empties dist/ first and copies public/ into it, which also covers the
# original: it references /favicon-32.png, /video/*.mp4 and friends, and its
# public/ is byte-identical to this checkout's.
npx vite build

echo "==> Copying legacy-v1/ -> dist/v1/"
# The original was built with base '/', so its bundle asks for /assets/<hash>
# by absolute path. Its files go into the same dist/assets/ as the new build's.
# Names are content hashes, so a shared name is normally the same file (the K9
# photos are in both) and is skipped; a shared name with different bytes stops
# the build rather than silently serving one site's file to the other.
mkdir -p dist/v1
cp legacy-v1/index.html dist/v1/index.html
for f in legacy-v1/assets/*; do
  dest="dist/assets/$(basename "$f")"
  if [ -e "$dest" ]; then
    if cmp -s "$f" "$dest"; then continue; fi
    echo "error: $dest differs between the two builds" >&2
    exit 1
  fi
  cp "$f" "$dest"
done

# The archive stays reachable but out of search results, pointing at / as the
# page of record so the two don't compete as duplicates.
node -e '
  const fs = require("fs");
  const file = "dist/v1/index.html";
  const tags = `<head>\n    <meta name="robots" content="noindex" />\n    <link rel="canonical" href="https://alasmawi.dev/" />`;
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("<head>", tags));
'

echo "==> Done"
echo "    /     $(du -sh dist/index.html | cut -f1) index + $(ls dist/assets | wc -l | tr -d ' ') assets (both builds)"
echo "    /v1   original, from legacy-v1/"
