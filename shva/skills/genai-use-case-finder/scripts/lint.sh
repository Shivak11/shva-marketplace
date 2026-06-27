#!/usr/bin/env bash
# Lint a GenAI use-case analysis artifact (markdown or HTML) for Shiva's banned punctuation.
# Usage: bash scripts/lint.sh <file1> [file2 ...]
# Exits non-zero on any hit. Expected clean output: "CLEAN".
#
# NOTE: This skill produces an ANALYSIS artifact, not a participant-facing worksheet.
# Citing the underlying books (Power and Prediction, The Goal, and so on) is allowed
# in the method reference and the analysis rationale, so author-name bans are NOT
# enforced here. Only the em-dash and en-dash bans carry over from the sibling skills.

set -u
if [ "$#" -eq 0 ]; then
  echo "usage: bash lint.sh <file...>" >&2
  exit 2
fi

# em-dash and en-dash (literal glyphs). These are never allowed in any artifact.
PATTERN='—|–'

hits=0
for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "MISSING: $f" >&2
    hits=$((hits+1))
    continue
  fi
  if grep -nE "$PATTERN" "$f"; then
    echo "  ^-- banned dash glyph in $f" >&2
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
