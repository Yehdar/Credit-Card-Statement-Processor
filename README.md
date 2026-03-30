# Spending Wrapped

A "Spotify Wrapped"-style credit card statement analyzer. Paste raw statement text and get an animated, slide-by-slide breakdown of your spending — persona, stats, top merchant, night owl habits, biggest flex, and Canadian rewards optimization.

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Go 1.22 · `net/http` (stdlib only + godotenv) |
| AI | Gemini 2.0 Flash (`gemini-2.0-flash`) |
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion |

## Project Structure

```
Credit-Card-Statement-Processor/
├── backend/
│   ├── main.go              # HTTP server + CORS middleware
│   ├── handlers/analyze.go  # POST /api/analyze
│   ├── models/wrapped.go    # Go structs (snake_case JSON tags)
│   ├── gemini/client.go     # Gemini 2.0 Flash client + system prompt
│   └── go.mod
└── frontend/
    ├── app/page.tsx          # State machine: input → loading → wrapped → error
    ├── components/
    │   ├── StatementInput.tsx
    │   ├── LoadingScreen.tsx
    │   ├── ErrorBanner.tsx
    │   └── wrapped/          # Slide components + orchestration
    ├── hooks/useWrappedData.ts
    ├── types/wrapped.ts      # TypeScript mirror of Go structs
    └── lib/api.ts
```

## Getting Started

### Prerequisites

- [Go 1.22+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Backend

```bash
cd backend
# Create a .env file with the following contents:
# GEMINI_API_KEY=your_key_here
# ALLOWED_ORIGIN=http://localhost:3000
# PORT=8080
go mod tidy
go run .
# Listening on :8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

The Next.js dev server proxies `/api/*` to the Go backend at `localhost:8080` via `next.config.ts` rewrites — no CORS configuration needed.

## API

### `POST /api/analyze`

**Request body:**
```json
{ "statement_text": "Jan 5  TIM HORTONS  $4.50\nJan 6  SOBEYS  $62.10\n..." }
```

**Response:**
```json
{
  "data": {
    "meta_data": { "account_holder": null, "persona_title": "The Caffeine Addict", "vibe_check": "..." },
    "stats_summary": { "total_spent": 842.37, "top_category": "Dining", "transaction_count": 34 },
    "wrapped_slides": [
      { "slide_type": "top_merchant", "headline": "...", "main_stat": "$...", "context": "..." },
      { "slide_type": "night_owl",    "headline": "...", "main_stat": "...", "context": "..." },
      { "slide_type": "big_flex",     "headline": "...", "main_stat": "$...", "context": "..." }
    ],
    "rewards_engine": { "points_earned": 3200, "missed_bag": 910, "optimization_tip": "..." }
  }
}
```

**Limits:** Statement text capped at 50KB.

### `GET /health`

Returns `{"status":"ok"}`.

## Slides

| Slide | Data Source | Color |
|---|---|---|
| Intro | `meta_data` (persona title + vibe check) | Charcoal/slate |
| Stats | `stats_summary` (counting animations) | Deep blue |
| Top Merchant | `wrapped_slides[0]` | Amber/orange |
| Night Owl | `wrapped_slides[1]` | Indigo/purple |
| Big Flex | `wrapped_slides[2]` | Emerald/teal |
| Rewards | `rewards_engine` (points + tip) | Gold/yellow |

Navigate by swiping, clicking the edge arrows, or tapping the dot indicators.

## Rewards Calculation

Canadian standard earn tiers used for `points_earned` and `missed_bag`:

| Category | Points per $1 CAD |
|---|---|
| Dining & Groceries | 5× |
| Transport & Shopping | 2× |
| Entertainment & Services | 1× |

`missed_bag` = (total_spent × 5) − points_earned — the gap between what you earned and the theoretical max.
