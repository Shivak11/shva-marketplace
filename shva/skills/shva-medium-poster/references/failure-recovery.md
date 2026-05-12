# Failure Recovery — Modes and Mitigations

Empirically observed during the 2026-05-12 4-essay session. Each failure has a detection signal and a recovery procedure.

| Failure | Detection | Recovery |
|---|---|---|
| **Tutorial overlay still open** | Editor keystrokes don't land — screenshot shows overlay covering editor | Click X at top-right of viewport (coords from chrome-dom-landmarks.md); re-screenshot to confirm; retry once if first click misses |
| **Import returned cached content** | Sentinel string absent from body after import (see cache-detection.md) | Halt; surface options to user (wait, bump slug, force_proceed) |
| **Tag autocomplete dropdown empty** | `find` returns "no match" after 3s wait | Wait additional 5s and retry; if still empty after retry, skip this tag and continue with the rest |
| **First-tag-autocomplete fails on freshly-clicked combobox** | First JS `.click()` on dropdown returns no matching button | Documented race. Retry once after 5s wait. Subsequent tags succeed normally |
| **First Publish click misses modal** | After 5s, URL hasn't changed to include `/submission?` and no modal visible | Click Publish again; if still fails after second attempt, escalate to user |
| **`Something is wrong and we cannot save your story` banner** | `document.body.textContent.includes('Something is wrong')` | Reload page; recent unsaved changes lost; alert user; re-run the failed operation from a known-good state |
| **Save state desync after JS DOM manipulation** | `Saving...` indicator stays orange indefinitely (>30s) | Reload page; lose recent changes; fall back to manual recovery; alert user |
| **Medium changed a selector** | `find` fails with "no match" for a known landmark (e.g., `h3.graf--title` returns null) | Fall back to coordinate-based clicks with screenshot verification; alert user that Medium UI changed; recommend updating chrome-dom-landmarks.md |
| **`Cmd+A` accidentally fired (post nuked)** | `document.querySelector('.postArticle-content').innerText.length < 100` after recent typing | `Cmd+Z` spam (8-12 times) to recover; if recovered, alert user; if not, reload (loses progress since last save) |
| **Title typing dropped letters after leading unicode** | After title-type, `h3.graf--title` matches `/^[₹€£]$/` | Re-trigger title trim (Op 6) with workaround text (e.g., `"Rs"` instead of `"₹"`) |
| **Image deletion fails on first attempt (still selected)** | `figure.graf` count unchanged after Backspace + 2s wait | Re-query image bounds (viewport may have scrolled); re-click image; Backspace again |
| **Title-adjacent empty paragraph won't delete** | Forward-Delete-from-title doesn't work (Medium blocks title-body merge) | Switch to Phase A pattern: cursor at START of first content paragraph, then Backspace |
| **Image gone but new empty paragraph created** | After image deletion, `.graf--empty` count increased by 1 | Expected. Will be cleaned up in Op 5 (Gap Cleanup) |
| **Publish modal opens but missing publication card** | "Built at Rehearsal" not in modal options | Verify user has editor access to the publication; navigate to `medium.com/built-at-rehearsal/about` and confirm; if access lost, escalate |
| **Send-for-review button missing, only Approve-and-publish visible** | User has admin role on the pub, not editor → Medium hides review queue | Confirm with user: proceed with approve-and-publish? If yes, document it explicitly in the session log. If no, halt |
| **Logged out mid-flight** | Any navigation lands on `/m/signin` | Halt; alert user; user signs in manually via Chrome; rerun from last completed state |
| **Chrome MCP loses tab context** | `tabs_context_mcp` returns empty or tabs don't match expected | Reconnect by spawning a new tab; navigate back to draft URL; resume from last state-machine waypoint |

## Recovery State Persistence (Optional)

For long pipelines, persist the state machine waypoint to a local file in the working directory:

```yaml
# .shva-medium/poster-state-{slug}.yaml
slug: india-ai-readiness-tier-2-problem
medium_draft_id: 628001485949
state: GAPS_CLEANED  # last completed waypoint
title_trimmed: false
tags_set: false
submitted: false
updated: 2026-05-12T16:32:00+05:30
```

On rerun, read this file and resume from the next waypoint. Skip already-completed ops.

## Pre-Flight Re-Check (after recovery)

After any recovery action, re-run the pre-flight checks from SKILL.md before continuing:
1. Logged into Medium
2. Editor accessible (load `/p/<id>/edit` and verify `.postArticle-content` exists)
3. Tutorial overlay dismissed (no `[role="dialog"]` covering editor)

Only then resume the state machine from the post-recovery waypoint.
