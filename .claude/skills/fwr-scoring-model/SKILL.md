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
- **Pass:** `percentage >= quiz.passing_score` (default 70) — service.py ~503. Percentage is over
  every active question in the quiz; unanswered (`null`) counts as wrong.
- Started-but-unsubmitted attempts don't count towards scores (backend change 2026-11-13).
- **Level weights:** `{1: 0.6, 2: 0.8, 3: 1.0, 4: 1.3, 5: 1.6}`.
- **Technical score (live 2026-11-13):** level-weighted % of the maximum —
  `Σ(latest % on each quiz × level weight) / Σ(weights of all the career's quizzes)`. Untaken
  quizzes count as 0. 100% on every level = 100; Level 1 alone at 100% = 11.32.
- **Soft-skills score:** latest attempt percentage on any quiz whose specialisation name
  contains `"SOFT"`.
- **Readiness:** `0.8 × technical + 0.2 × soft`, stored with 2 decimals on both the submit and
  recompute paths (the old `int()` truncation on submit is gone). Perfect run = 100.
- **`score_impact` (submit response):** `quiz_points` = this quiz's contribution (out of 100) to
  the technical score; `level_multiplier` = level weight. Typed in `hooks/api/useQuizzes.ts`,
  not displayed anywhere yet.
- **Which career updates:** technical quiz → career with matching `specialization_id`, else
  primary; soft-skills quiz → primary. If the updated career is primary, user-level score fields
  are mirrored.
- **History:** before 2026-11-13 the formula was `(percentage/20) × weight` summed, which capped
  technical at 26.5 and readiness at 41.2. All stored scores were recomputed (~3.77× lift,
  rankings unchanged; goals not touched). Frontend bands always assumed 0–100 and needed no change.
- **Level naming mismatch:** backend docstrings say Foundational/Beginner/Intermediate/Advanced/
  Expert; frontend `lib/constants/skillLevels.ts` says Beginner/Intermediate/Proficient/Master/
  Expert. Both map to `difficulty_level` 1–5.

## Frontend display thresholds
- `components/dashboard/ReadinessGauge.tsx`: ≥80 Excellent, ≥60 Good, ≥40 Developing, <40 no label.
  Values are not rounded.
- `app/(protected)/soft-skills/results/page.tsx` (~111–153): colours at 80/70/50; messages at
  90/80/70/50; recommendations split at 70/85.
- `app/(protected)/tests/[specialisation]/[level]/results/page.tsx`: fallback recommendations at 90/70.
- `app/(protected)/benchmarking/page.tsx` (~107): `completedLevels = floor(technicalScore / 20)` —
  computed but never rendered (dead). It's not a real level count under either formula; delete it
  rather than display it.
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
