#!/usr/bin/env bash
# Assemble the deployable tree:
#
#   dist/            the original site, from the committed legacy-v1/  -> /
#   dist/v2/         the Nocturne refactor, built from this checkout   -> /v2
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
  echo "error: legacy-v1/index.html is missing — nothing to serve at /." >&2
  echo "       Regenerate it with: bash scripts/snapshot-v1.sh" >&2
  exit 1
fi

# Vite only clears its own outDir (dist/v2), so the root is cleared here or
# stale files from a previous build survive.
rm -rf dist
mkdir -p dist

echo "==> Building the refactor -> dist/v2/"
# base and outDir come from vite.config.js. This also copies public/ into
# dist/v2, which is why the copy below only has to cover the root.
npx vite build

echo "==> Copying public/ -> dist/"
# The original references /favicon-32.png, /video/*.mp4 and friends. Its
# public/ is byte-identical to this checkout's, so the live one is used rather
# than a second committed copy.
cp -R public/. dist/

echo "==> Copying legacy-v1/ -> dist/"
cp -R legacy-v1/. dist/
rm -f dist/README.md

echo "==> Done"
echo "    /     $(du -sh dist/assets | cut -f1) assets   (original, from legacy-v1/)"
echo "    /v2   $(du -sh dist/v2/assets | cut -f1) assets   (refactor, built here)"
