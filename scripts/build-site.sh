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
# In Node, not shell: Vercel's build image lacks some of the usual tools (it
# has no `cmp`), and Node is the one thing a Vite build is guaranteed to have.
node scripts/copy-legacy.mjs

echo "==> Done"
