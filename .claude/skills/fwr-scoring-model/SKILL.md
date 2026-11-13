---
name: fwr-scoring-model
description: How FWR readiness, technical and soft-skill scores, pass marks and score bands work, and where they are displayed. Use when changing or explaining any score, percentage, pass/fail, level multiplier, readiness gauge, benchmark percentile, or score-driven goal in fwr-frontend.
---

# FWR scoring model

**Rule: the frontend never computes scores.** All scoring is in the backend
(`../FWR_BackEnd/src/app/modules/quizzes/service.py`). The frontend displays values from
`/careers/dashboard`, `/careers/{id}/dashboard`, `/quizzes/attempts/{id}/submit` and
`/users/{id}/peer-benchmark`. If a score looks wrong, fix it in the backend, not with frontend math.

## Backend formulas (verified 2026-11-13; re-check line numbers before relying on them)
- **Pass:** `percentage >= quiz.passing_score` (default 70) — service.py ~503.
- **Points per quiz:** `(percentage / 20) × LEVEL_MULTIPLIERS[level]`,
  multipliers `{1: 0.6, 2: 0.8, 3: 1.0, 4: 1.3, 5: 1.6}` — service.py ~36–72.
- **Technical score:** sum of points from the *latest* attempt on each quiz in the
  specialisation, capped at 100.
- **Soft-skills score:** latest attempt percentage on any quiz whose specialisation name
  contains `"SOFT"`.
- **Readiness:** `0.8 × technical + 0.2 × soft`. Submit path truncates with `int()` (~633);
  recompute path uses `round(…, 2)` (~841, ~906). Inconsistent rounding is a known issue.
- **Which career updates:** technical quiz → career with matching `specialization_id`, else
  primary; soft-skills quiz → primary. If the updated career is primary, user-level score fields
  are mirrored.
- **Known ceiling:** `/quizzes/find` returns the first active quiz per (spec, level), so with one
  quiz per level technical maxes at 5 × (0.6+0.8+1.0+1.3+1.6) = 26.5 → readiness ≈ 41. Treat as a
  suspected design bug; confirm with the backend owner before "fixing" displays.
- **Level naming mismatch:** backend docstrings say Foundational/Beginner/Intermediate/Advanced/
  Expert; frontend `lib/constants/skillLevels.ts` says Beginner/Intermediate/Proficient/Master/
  Expert. Both map to `difficulty_level` 1–5.

## Frontend display thresholds
- `components/dashboard/ReadinessGauge.tsx`: ≥80 Excellent, ≥60 Good, ≥40 Developing, <40 no label.
  Values are not rounded.
- `app/(protected)/soft-skills/results/page.tsx` (~111–153): colours at 80/70/50; messages at
  90/80/70/50; recommendations split at 70/85.
- `app/(protected)/tests/[specialisation]/[level]/results/page.tsx`: fallback recommendations at 90/70.
- `app/(protected)/benchmarking/page.tsx` (~107): `completedLevels = floor(technicalScore / 20)`.
- If you change a band, change it everywhere it appears — they aren't centralised.

## Benchmarking rules (backend `modules/benchmarks/service.py`; older summary in `../Future_of_work_readiness/PEER_BENCHMARKING_SUMMARY.md`)
- Peers = same specialisation; need ≥5 users (`MIN_USERS_FOR_BENCHMARK = 5`, service.py ~30 —
  the old summary doc says 2, the code wins), otherwise a 400 the frontend shows as "not enough peers".
- Percentile = below_count / total × 100; UI shows "Better than {p}% of peers"
  (`benchmarking/page.tsx` ~238, ~289).
- Status: diff > +5 → above, < −5 → below, else average. Strengths = peer avg ≥70, gaps <60.
- Categories shown: Overall Readiness, Technical Skills, Soft Skills (leadership removed 2026-01-05).
- The per-career panel reuses the single user-level "Technical Skills" peer average for every
  career — a known approximation.

## Goals and scores
The backend auto-updates only goals with category `readiness`, `technical` or `soft_skills` after
a quiz (`goals/service.py` ~174). Goals created from the UI default to category `custom`, so they
are never auto-updated.
