#!/usr/bin/env bash
# Lint mdp-source-finder files for Shiva's banned strings.
# Author and source names ARE allowed here (this skill produces a source list),
# so only the em-dash and en-dash bans apply.
# Usage: bash scripts/lint.sh <file1> [file2 ...]
# Exits non-zero on any hit. Expected clean output: "CLEAN".

set -u
if [ "$#" -eq 0 ]; then
  echo "usage: bash lint.sh <file...>" >&2
  exit 2
fi

# em-dash and en-dash (literal). No author/source-name bans for this skill.
PATTERN='—|–'

hits=0
for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "MISSING: $f" >&2
    hits=$((hits+1))
    continue
  fi
  if grep -nE "$PATTERN" "$f"; then
    echo "  ^-- banned string (em-dash or en-dash) in $f" >&2
    hits=$((hits+1))
  fi
done

if [ "$hits" -eq 0 ]; then
  echo "CLEAN"
  exit 0
else
  echo "FAILED: $hits file(s) with banned strings. Fix before shipping." >&2
  exit 1
fi
