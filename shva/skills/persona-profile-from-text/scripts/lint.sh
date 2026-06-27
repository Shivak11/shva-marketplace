#!/usr/bin/env bash
# Lint the persona-profile-from-text skill files for banned strings.
# Usage: bash scripts/lint.sh <file1> [file2 ...]
# Exits non-zero on any hit. Expected clean output: "CLEAN".

set -u
if [ "$#" -eq 0 ]; then
  echo "usage: bash lint.sh <file...>" >&2
  exit 2
fi

# 1. em-dash and en-dash (literal). Never allowed in any file.
DASH='—|–'

# 2. fabricated-precision tells: a framework trait name immediately followed by a
#    number (a printed score). This is the principle-2 violation we must never ship.
#    Scoped to "Word: 73" / "Word 73%" shapes so it does NOT catch the legitimate
#    confidence thresholds in prose (for example "above 0.6" or "0.6 confidence").
SCORE='(Openness|Conscientiousness|Extraversion|Agreeableness|Neuroticism|Openness to experience|Neurotic)[: ]+[0-9]+(\.[0-9]+)?%?|(trait|score|percentile)[: ]+[0-9]{2,}'

hits=0
for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "MISSING: $f" >&2
    hits=$((hits+1))
    continue
  fi
  if grep -nE "$DASH" "$f"; then
    echo "  ^-- em-dash or en-dash in $f (use periods, colons, commas, parentheses)" >&2
    hits=$((hits+1))
  fi
  if grep -nEi "$SCORE" "$f"; then
    echo "  ^-- looks like a printed trait score in $f (principle 2: never print scores)" >&2
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
