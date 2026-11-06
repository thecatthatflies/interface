#!/usr/bin/env bash
# Install the interface skills for Claude Code, Codex, or any agent that reads a skills folder.
#   ./install.sh                 all skills into ~/.claude/skills
#   ./install.sh --codex         all skills into ~/.codex/skills
#   ./install.sh --dir <path>    all skills into <path>
#   ./install.sh brand-identity dashboard-design   only the named skills
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
dest="$HOME/.claude/skills"
names=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --codex) dest="$HOME/.codex/skills"; shift ;;
    --dir) dest="$2"; shift 2 ;;
    -h|--help) sed -n '2,6p' "$0"; exit 0 ;;
    *) names+=("$1"); shift ;;
  esac
done
if [[ ${#names[@]} -eq 0 ]]; then
  for d in "$here"/skills/*/; do names+=("$(basename "$d")"); done
fi

mkdir -p "$dest"
for n in "${names[@]}"; do
  src="$here/skills/$n"
  if [[ ! -f "$src/SKILL.md" ]]; then echo "No skill named $n" >&2; exit 1; fi
  rm -rf "${dest:?}/$n"
  cp -R "$src" "$dest/$n"
  echo "Installed $n -> $dest/$n"
done
# The foundation is referenced by every other skill; install it alongside any subset.
if [[ ! -d "$dest/interface-guidelines" ]]; then
  cp -R "$here/skills/interface-guidelines" "$dest/interface-guidelines"
  echo "Installed interface-guidelines (the shared foundation) -> $dest/interface-guidelines"
fi
