# CLAUDE.md — Spending Wrapped

## Project Overview

Full-stack "Spotify Wrapped"-style credit card statement analyzer.

- **Input:** Raw pasted statement text (messy, Google Doc artifacts welcome)
- **Processing:** Gemini 2.0 Flash normalizes merchants, categorizes transactions, generates witty persona/insights
- **Output:** Animated slide experience (6 slides) with Canadian rewards optimization

## Architecture

```
POST /api/analyze
  └── backend/handlers/analyze.go   (50KB body limit, 400/502 errors)
       └── backend/gemini/client.go  (Gemini REST, system prompt, JSON extraction)
            └── backend/models/wrapped.go (Go structs → json.Unmarshal)

frontend/app/page.tsx               (state machine: idle→loading→success→error)
  ├── components/StatementInput      (textarea + submit)
  ├── components/LoadingScreen       (breathing card animation)
  ├── components/ErrorBanner         (reset on error)
  └── components/wrapped/
       ├── WrappedExperience         (top bar + SlideContainer)
       ├── SlideContainer            (AnimatePresence, swipe, nav arrows)
       ├── NavigationDots            (animated pill dots)
       └── slides/
            ├── IntroSlide           ← meta_data
            ├── StatsSummarySlide    ← stats_summary (CountUp animations)
            ├── GenericSlide         ← top_merchant / night_owl / big_flex
            └── RewardsSlide         ← rewards_engine
```

## JSON Contract

All fields use `snake_case`. The Go backend uses `json.Unmarshal` strictly — never change field names without updating both `backend/models/wrapped.go` and `frontend/types/wrapped.ts`.

```
meta_data.account_holder  → *string (nullable, not omitempty)
stats_summary.total_spent → float64
rewards_engine.points_earned / missed_bag → int (not float)
wrapped_slides            → always exactly 3 slides in order: top_merchant, night_owl, big_flex
```

## Key Files

| File | What it does |
|---|---|
| `backend/gemini/client.go` | Contains the full Gemini system prompt as a Go const. Edit this to change AI behavior. |
| `backend/models/wrapped.go` | Single source of truth for the JSON schema on the Go side. |
| `frontend/types/wrapped.ts` | TypeScript mirror — keep in sync with models/wrapped.go. |
| `frontend/next.config.ts` | Proxies `/api/*` → `http://localhost:8080`. Change `API_BASE_URL` env var for non-local backend. |
| `frontend/hooks/useWrappedData.ts` | All fetch state lives here. The page is a dumb consumer. |

## Environment Variables

**Backend** (`.env`, never commit):
```
GEMINI_API_KEY=   # Required
ALLOWED_ORIGIN=   # Default: http://localhost:3000
PORT=             # Default: 8080
```

**Frontend** (`.env.local`, never commit):
```
API_BASE_URL=     # Used by next.config.ts rewrites. Default: http://localhost:8080
NEXT_PUBLIC_API_URL=  # Only needed if bypassing the proxy
```

## Gemini Prompt

The system prompt in `backend/gemini/client.go` instructs Gemini to:
1. Return **raw JSON only** (no prose, no fences) — enforced by `responseMimeType: "application/json"` + defensive `extractJSON()` fence stripper
2. Normalize merchant names to Title Case, strip location suffixes
3. Categorize into: Dining | Transport | Groceries | Entertainment | Shopping | Services
4. Generate a witty `persona_title` (2-5 words) and `vibe_check` (≤15 words)
5. Apply Canadian rewards tiers: 5×/2×/1× for points calculation
6. Return `null` / `0` / `""` for missing data — never hallucinate transactions

`temperature: 0.2` keeps output deterministic while allowing creative persona copy.

## Slide Navigation

- **Swipe** left/right (`drag="x"` on the slide div, 80px threshold)
- **Click** left/right edge arrow buttons (visible on hover)
- **Tap** navigation dots (jump to any slide)
- **"Start Over"** button appears on the final slide

## Adding a New Slide Type

1. Add the new `slide_type` value to `SlideType` in `frontend/types/wrapped.ts`
2. Add a corresponding entry to `SLIDE_CONFIG` in `GenericSlide.tsx` (or create a new slide component)
3. Register the slide in `SlideContainer.tsx` → `buildSlides()` and `renderSlide()`
4. Update the Gemini system prompt to produce the new slide in `wrapped_slides`
5. Update the Go `Slide` struct if the shape changes

## Common Tasks

**Change the AI tone/persona logic:** Edit `systemPrompt` const in `backend/gemini/client.go`.

**Add a new spending category:** Update the `CATEGORIZATION` and `REWARDS ENGINE` sections in the system prompt.

**Change slide colors:** Edit `SLIDE_CONFIG` in `frontend/components/wrapped/slides/GenericSlide.tsx`.

**Change animation timing:** Edit `slideVariants` in `frontend/components/wrapped/SlideContainer.tsx`.
