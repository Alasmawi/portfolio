#!/usr/bin/env bash
# Build both versions of the site into one deployable tree:
#
#   dist/            the original site, from the `main` branch      -> served at /
#   dist/v2/         the Nocturne refactor, from this branch        -> served at /v2
#
# The two versions are two source trees, not two configs, so one `vite build`
# cannot produce both. `main` is checked out into a throwaway git worktree and
# built alongside the current branch.
#
# One npm install covers both: this branch's dependencies are a strict superset
# of main's (it adds `three`), so the worktree borrows the installed
# node_modules rather than running its own install.
set -euo pipefail

# Pinned to a dedicated branch, not to main. Once the refactor lands on main,
# main *is* the new design — so building "the original" from main would serve
# the refactor at / and /v2 alike. origin/v1-original is parked at d1e7746, the
# last commit before the Nocturne work, and nothing is meant to move it.
ORIGINAL_REF="${ORIGINAL_REF:-origin/v1-original}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE="$(mktemp -d)/original"

cd "$ROOT"

# A CI checkout is usually shallow and carries only the deployed branch, so the
# ref generally has to be fetched before it can be built.
#
# The refspec is not optional. `git clone --depth 1 --branch main` configures
# remote.origin.fetch for main alone, so a bare `git fetch origin v1-original`
# resolves the branch, writes FETCH_HEAD, and creates no origin/v1-original —
# leaving the build to die on "invalid reference" one line later. Naming the
# destination is what actually creates the remote-tracking ref.
if ! git rev-parse --verify --quiet "$ORIGINAL_REF^{commit}" >/dev/null; then
  echo "==> $ORIGINAL_REF not present, fetching"
  case "$ORIGINAL_REF" in
    origin/*)
      name="${ORIGINAL_REF#origin/}"
      git fetch --depth=1 origin "+refs/heads/$name:refs/remotes/origin/$name"
      ;;
    *)
      git fetch --depth=1 origin "$ORIGINAL_REF"
      ;;
  esac
fi

if ! git rev-parse --verify --quiet "$ORIGINAL_REF^{commit}" >/dev/null; then
  echo "error: cannot resolve $ORIGINAL_REF — the original site cannot be built." >&2
  echo "       Set ORIGINAL_REF to a ref this checkout can reach." >&2
  exit 1
fi

cleanup() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || true
}
trap cleanup EXIT

echo "==> Building the original site from $ORIGINAL_REF -> dist/"
git worktree add --detach --force "$WORKTREE" "$ORIGINAL_REF" >/dev/null
# Resolution only: Vite and the plugins are found through this symlink.
ln -s "$ROOT/node_modules" "$WORKTREE/node_modules"
# --emptyOutDir is required because dist/ is outside the worktree's own root;
# without it Vite refuses to clear a directory it does not consider its own.
# This runs first, so the wipe happens before dist/v2 exists.
(cd "$WORKTREE" && npx vite build --base=/ --outDir "$ROOT/dist" --emptyOutDir)

echo "==> Building the refactor from $(git rev-parse --abbrev-ref HEAD) -> dist/v2/"
# Reads base and outDir from vite.config.js. Its outDir is inside dist/, so it
# clears only dist/v2 and leaves the original build alone.
npx vite build

echo "==> Done:"
echo "    /      $(find dist -maxdepth 1 -type f | wc -l) files + assets   (original)"
echo "    /v2    $(find dist/v2 -maxdepth 1 -type f | wc -l) files + assets   (refactor)"
