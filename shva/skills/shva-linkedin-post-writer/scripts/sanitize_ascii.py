#!/usr/bin/env python3
"""
sanitize_ascii.py — Pure-ASCII transform for LinkedIn post text.

Why this exists: LinkedIn's API (via the claude_ai_Linkedin MCP) silently
truncates posts containing certain non-ASCII byte sequences. Validated
2026-04-25: a 1,577-char post with em-dashes and Sanskrit diacritics
truncated at "preya" (~1,003 chars) on two consecutive publish attempts.
Same content rewritten to pure ASCII published cleanly.

This script is the deterministic transform. Run it BEFORE saving a draft.
The transform is conservative — it preserves voice while removing the
characters that have been shown to cause truncation.

Usage
-----

  # From a file
  python3 sanitize_ascii.py < draft.txt > sanitized.txt

  # Piped
  echo "Take the interview — the highest-stakes choosing moment" | python3 sanitize_ascii.py

  # Validate only (exit 1 if non-ASCII found)
  python3 sanitize_ascii.py --validate < draft.txt

  # Show what would change without applying
  python3 sanitize_ascii.py --diff < draft.txt

Replacement table (validated transforms)
----------------------------------------

  —  →  -      em-dash → hyphen
  –  →  -      en-dash → hyphen
  "  →  "      smart-double-open → straight
  "  →  "      smart-double-close → straight
  '  →  '      smart-single-open → straight
  '  →  '      smart-single-close / right apostrophe → straight
  …  →  ...    ellipsis → three dots
  ī ā ū ē ō    macrons stripped (Sanskrit transliteration)
  ñ ç ä ö ü    Latin diacritics stripped
    →  ' ' non-breaking space → regular space

Hashtags with periods (e.g. #tryrehearsal.ai) are flagged but NOT auto-fixed
— the user should explicitly choose between dropping the dot or moving the
URL into post body.
"""
from __future__ import annotations

import argparse
import sys
import unicodedata
from typing import Tuple


# Direct ASCII-equivalent substitutions. Validated to publish cleanly.
DIRECT_REPLACEMENTS = {
    "—": "-",   # em-dash
    "–": "-",   # en-dash
    "−": "-",   # minus sign
    "‘": "'",   # left single quote
    "’": "'",   # right single quote / apostrophe
    "‚": "'",   # single low-9 quote
    "“": '"',   # left double quote
    "”": '"',   # right double quote
    "„": '"',   # double low-9 quote
    "…": "...", # horizontal ellipsis
    " ": " ",   # non-breaking space
    "​": "",    # zero-width space
    "‌": "",    # zero-width non-joiner
    "‍": "",    # zero-width joiner
    "﻿": "",    # zero-width no-break space (BOM)
    "•": "-",   # bullet
    "‐": "-",   # hyphen
    "‑": "-",   # non-breaking hyphen
    "·": "-",   # middle dot
}


def sanitize(text: str) -> str:
    """
    Transform text to pure ASCII suitable for LinkedIn publish.

    Strategy:
      1. Apply direct substitutions for known typography (em-dashes etc.)
      2. NFKD-normalize the rest, which decomposes diacritics into
         base-char + combining-mark, then strip the combining marks.
      3. Drop anything still non-ASCII (emoji, CJK, etc.) — these are
         caller's responsibility to handle separately.

    The macron-stripping pass covers Sanskrit transliterations like
    `dhīra` → `dhira`, `Pāṇini` → `Panini` automatically.
    """
    # Step 1: direct substitutions
    out_chars = []
    for c in text:
        if c in DIRECT_REPLACEMENTS:
            out_chars.append(DIRECT_REPLACEMENTS[c])
        else:
            out_chars.append(c)
    text = "".join(out_chars)

    # Step 2: NFKD-decompose then drop combining marks
    nfkd = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in nfkd if not unicodedata.combining(c))

    # Step 3: drop any remaining non-ASCII (emoji, CJK, etc.)
    text = text.encode("ascii", errors="ignore").decode("ascii")

    return text


def find_non_ascii(text: str) -> list[Tuple[int, str, int]]:
    """Return list of (position, char, codepoint) for non-ASCII chars."""
    return [(i, c, ord(c)) for i, c in enumerate(text) if ord(c) > 127]


def find_dotted_hashtags(text: str) -> list[str]:
    """Detect hashtags containing periods (LinkedIn parses these incorrectly)."""
    import re
    # match #word.word patterns
    return re.findall(r"#\w+\.\w+", text)


def show_diff(original: str, sanitized: str) -> None:
    """Print line-by-line diff of changes."""
    o_lines = original.splitlines()
    s_lines = sanitized.splitlines()
    for i, (o, s) in enumerate(zip(o_lines, s_lines), 1):
        if o != s:
            print(f"Line {i}:", file=sys.stderr)
            print(f"  - {o}", file=sys.stderr)
            print(f"  + {s}", file=sys.stderr)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sanitize text to pure ASCII for LinkedIn publish.",
        epilog="Reads from stdin, writes to stdout. Returns exit 1 on --validate failure.",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Validate only: exit 0 if pure ASCII, exit 1 (with details on stderr) if not.",
    )
    parser.add_argument(
        "--diff",
        action="store_true",
        help="Show what would change (line-by-line) on stderr; do not write to stdout.",
    )
    parser.add_argument(
        "--check-hashtags",
        action="store_true",
        help="Also flag hashtags containing periods (e.g. #tryrehearsal.ai).",
    )
    args = parser.parse_args()

    text = sys.stdin.read()

    if args.validate:
        problems = find_non_ascii(text)
        if args.check_hashtags:
            dotted = find_dotted_hashtags(text)
            if dotted:
                print(f"WARNING: dotted hashtags found: {dotted}", file=sys.stderr)
        if problems:
            print(f"FAIL: {len(problems)} non-ASCII char(s):", file=sys.stderr)
            for pos, c, cp in problems[:10]:
                print(f"  pos {pos}: {c!r} (U+{cp:04X})", file=sys.stderr)
            if len(problems) > 10:
                print(f"  ... and {len(problems) - 10} more", file=sys.stderr)
            return 1
        print("PASS: pure ASCII", file=sys.stderr)
        return 0

    sanitized = sanitize(text)

    if args.diff:
        show_diff(text, sanitized)
        return 0

    # Default: write sanitized text to stdout
    sys.stdout.write(sanitized)

    # If hashtag warnings requested, print on stderr (doesn't affect stdout)
    if args.check_hashtags:
        dotted = find_dotted_hashtags(sanitized)
        if dotted:
            print(f"\nWARNING: hashtags with periods (LinkedIn parses oddly): {dotted}", file=sys.stderr)
            print("Consider dropping the .ai suffix or moving the URL to post body.", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
