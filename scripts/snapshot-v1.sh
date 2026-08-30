#!/usr/bin/env bash
# Regenerate legacy-v1/ — the frozen build of the pre-refactor site served at /.
#
# DEVELOPER TOOL, NOT PART OF A DEPLOY. Deploys must not depend on git: a CI
# checkout is shallow, may not carry other branches, and may hold no credentials
# to fetch them. Doing this work here, once, and committing the result is what
# keeps `npm run build:site` a pure filesystem operation.
#
# You should only ever need to run this if the original site itself has to
# change, which it is not expected to.
set -euo pipefail

ORIGINAL_REF="${ORIGINAL_REF:-origin/v1-original}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE="$(mktemp -d)/original"
STAGE="$(mktemp -d)/build"

cd "$ROOT"

if ! git rev-parse --verify --quiet "$ORIGINAL_REF^{commit}" >/dev/null; then
  case "$ORIGINAL_REF" in
    origin/*)
      name="${ORIGINAL_REF#origin/}"
      git fetch --depth=1 origin "+refs/heads/$name:refs/remotes/origin/$name"
      ;;
    *) git fetch --depth=1 origin "$ORIGINAL_REF" ;;
  esac
fi

cleanup() { git worktree remove --force "$WORKTREE" 2>/dev/null || true; }
trap cleanup EXIT

echo "==> Building $ORIGINAL_REF ($(git rev-parse --short "$ORIGINAL_REF"))"
git worktree add --detach --force "$WORKTREE" "$ORIGINAL_REF" >/dev/null
ln -s "$ROOT/node_modules" "$WORKTREE/node_modules"
(cd "$WORKTREE" && npx vite build --base=/ --outDir "$STAGE" --emptyOutDir)

# Only the generated parts are kept. Everything the original copies out of
# public/ is skipped: public/ is byte-identical between that commit and main,
# so build-site.sh copies the live one instead of committing it twice.
echo "==> Snapshotting index.html + assets/ into legacy-v1/"
rm -rf "$ROOT/legacy-v1"
mkdir -p "$ROOT/legacy-v1"
cp "$STAGE/index.html" "$ROOT/legacy-v1/"
cp -R "$STAGE/assets" "$ROOT/legacy-v1/"

cat > "$ROOT/legacy-v1/README.md" <<MD
# legacy-v1 — generated, do not edit

The built pre-refactor site, served at \`/\`. Regenerate with
\`bash scripts/snapshot-v1.sh\`; never edit these files by hand.

- Source: \`$ORIGINAL_REF\` at \`$(git rev-parse "$ORIGINAL_REF")\`
- Contains only \`index.html\` and \`assets/\`. The original's \`public/\` files
  are byte-identical to main's, so \`scripts/build-site.sh\` copies the live
  \`public/\` rather than committing a second copy.
MD

echo "==> Done: $(du -sh "$ROOT/legacy-v1" | cut -f1) in legacy-v1/"
