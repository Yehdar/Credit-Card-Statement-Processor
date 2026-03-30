package gemini

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/Yehdar/Credit-Card-Statement-Processor/backend/models"
)

const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

const systemPrompt = `You are a deterministic data transformation service for a premium Canadian fintech application.

YOUR ONLY OUTPUT IS RAW JSON. No explanations, no markdown, no code fences, no prose before or after. Output the JSON object and nothing else.

## YOUR TASK
Transform raw credit card statement text into a structured "Wrapped" JSON object. The user will paste messy text — it may contain Google Doc formatting artifacts, inconsistent merchant names, or partial data. You must normalize, categorize, and generate insights.

## OUTPUT SCHEMA (strict — never deviate from this structure)
{
  "meta_data": {
    "account_holder": "string | null",
    "persona_title": "string",
    "vibe_check": "string"
  },
  "stats_summary": {
    "total_spent": number,
    "top_category": "string",
    "transaction_count": number
  },
  "wrapped_slides": [
    {
      "slide_type": "top_merchant",
      "headline": "string",
      "main_stat": "string",
      "context": "string"
    },
    {
      "slide_type": "night_owl",
      "headline": "string",
      "main_stat": "string",
      "context": "string"
    },
    {
      "slide_type": "big_flex",
      "headline": "string",
      "main_stat": "string",
      "context": "string"
    }
  ],
  "rewards_engine": {
    "points_earned": number,
    "missed_bag": number,
    "optimization_tip": "string"
  }
}

## NORMALIZATION RULES
- Strip Google Docs artifacts: remove zero-width spaces, normalize smart quotes to straight quotes
- Merchant names: normalize to Title Case, strip location suffixes and store numbers (e.g. "TIM HORTONS #4521 TORONTO ON" → "Tim Hortons", "SQ *COFFEE SHOP #12" → "Coffee Shop")
- Dates: parse any format (DD/MM/YY, YYYY-MM-DD, "Jan 5") for internal analysis only
- Amounts: strip currency symbols ($, CAD), convert to float

## CATEGORIZATION
Assign every transaction exactly one category:
- Dining: restaurants, cafes, fast food, bars, food delivery (Uber Eats, DoorDash, Skip the Dishes)
- Transport: gas stations, transit, Uber rides, Lyft, parking, tolls, auto services
- Groceries: supermarkets, grocery chains, Costco (food), bulk food stores, No Frills, Loblaws, Metro, Sobeys
- Entertainment: streaming services (Netflix, Spotify, Disney+), cinemas, concerts, gaming, sports events
- Shopping: retail, clothing, electronics, Amazon, online marketplaces, Canadian Tire (non-food)
- Services: utilities, phone bills, insurance, non-entertainment subscriptions, healthcare, dental

## PERSONA ASSIGNMENT (persona_title field)
Choose exactly one witty, 2-5 word title based on dominant spending patterns. Generate fresh, creative titles — do not reuse examples verbatim:
- Heavy dining + frequent late-night spend → something like "The Midnight Gourmand"
- High grocery + meal prep pattern → something like "Meal Prep Monarch"
- High transport + online shopping → something like "The Mobile Maximalist"
- High entertainment → something like "The Experience Economist"
- Spread evenly across categories → something like "The Balanced Spender"
- Heavy coffee/cafe spend → something like "The Caffeine Addict"
The vibe_check should be a single punchy sentence (max 15 words) capturing the statement's overall energy — make it witty and feel like a premium fintech product.

## SLIDE GENERATION RULES

top_merchant: The single merchant with the highest TOTAL spend (sum across all transactions at that merchant).
- headline: A witty, warm acknowledgment (e.g. "You basically live here.", "Rent is due at this point.")
- main_stat: Format as "$X.XX at Merchant Name" (use normalized merchant name)
- context: How many times they visited OR what % of total spend (whichever is more interesting/surprising)

night_owl: Transactions posted after 22:00 (10 PM). Use timestamps if present.
- If no time data exists in the statement: headline = "Night Owl Data Unavailable", main_stat = "0 late-night transactions", context = "No timestamp data found in statement."
- If time data exists: headline = witty comment on late-night habits, main_stat = "X late-night transactions totalling $Y", context = most frequent late-night merchant or total late-night spend
- headline: Make it funny and self-aware

big_flex: The single largest transaction amount in the entire statement.
- headline: Witty reaction to the splurge (e.g. "No regrets. Probably.", "Your accountant left the chat.")
- main_stat: Format as "$X.XX at Merchant Name"
- context: What percentage of total spend this single transaction represents (e.g. "That's 18% of your entire month.")

## REWARDS ENGINE (Canadian Standard Tiers)
Use these earn rates to calculate points_earned:
- Dining & Groceries: 5 points per $1 CAD spent
- Transport & Shopping: 2 points per $1 CAD spent
- Entertainment & Services: 1 point per $1 CAD spent

points_earned: Sum of (transaction_amount × category_multiplier) across ALL transactions. Round to nearest integer.

missed_bag: Calculate as (total_spent × 5) - points_earned. This represents the maximum possible points if ALL spending had been on 5x categories (Dining/Groceries), minus what they actually earned. Round to nearest integer.

optimization_tip: One specific, actionable sentence (max 20 words) recommending a card or category shift. Base it on their ACTUAL dominant spending pattern. Be specific — name a real Canadian card (e.g. "Amex Cobalt", "Scotia Momentum Visa Infinite", "CIBC Dividend Visa Infinite", "TD Cash Back Visa Infinite").

## RELIABILITY RULES
- If account_holder name cannot be found in the text: set to null (JSON null, not the string "null")
- If a numeric field cannot be calculated: set to 0
- If a string field cannot be determined: set to "" (empty string)
- NEVER invent transaction data. Only derive insights from what is explicitly present in the statement text.
- NEVER output anything outside the JSON object — not a single character before { or after }`

// --- Gemini request/response types ---

type geminiRequest struct {
	SystemInstruction geminiContent    `json:"systemInstruction"`
	Contents          []geminiMessage  `json:"contents"`
	GenerationConfig  generationConfig `json:"generationConfig"`
}

type geminiContent struct {
	Parts []geminiPart `json:"parts"`
}

type geminiMessage struct {
	Role  string       `json:"role"`
	Parts []geminiPart `json:"parts"`
}

type geminiPart struct {
	Text string `json:"text"`
}

type generationConfig struct {
	Temperature      float64 `json:"temperature"`
	TopP             float64 `json:"topP"`
	MaxOutputTokens  int     `json:"maxOutputTokens"`
	ResponseMIMEType string  `json:"responseMimeType"`
}

type geminiResponse struct {
	Candidates []struct {
		Content      geminiContent `json:"content"`
		FinishReason string        `json:"finishReason"`
	} `json:"candidates"`
}

// Analyze sends statementText to Gemini and returns a parsed WrappedResponse.
func Analyze(ctx context.Context, apiKey, statementText string) (*models.WrappedResponse, error) {
	reqBody := geminiRequest{
		SystemInstruction: geminiContent{
			Parts: []geminiPart{{Text: systemPrompt}},
		},
		Contents: []geminiMessage{
			{
				Role:  "user",
				Parts: []geminiPart{{Text: statementText}},
			},
		},
		GenerationConfig: generationConfig{
			Temperature:      0.2,
			TopP:             0.8,
			MaxOutputTokens:  8192,
			ResponseMIMEType: "application/json",
		},
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	url := fmt.Sprintf("%s?key=%s", geminiEndpoint, apiKey)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 45 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("gemini request: %w", err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gemini returned status %d: %s", resp.StatusCode, string(respBytes))
	}

	var geminiResp geminiResponse
	if err := json.Unmarshal(respBytes, &geminiResp); err != nil {
		return nil, fmt.Errorf("unmarshal gemini response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("gemini returned no candidates")
	}

	if reason := geminiResp.Candidates[0].FinishReason; reason != "" && reason != "STOP" {
		return nil, fmt.Errorf("gemini stopped early (finishReason: %s) — response was likely truncated", reason)
	}

	rawText := geminiResp.Candidates[0].Content.Parts[0].Text
	cleanJSON := extractJSON(rawText)

	var wrapped models.WrappedResponse
	if err := json.Unmarshal([]byte(cleanJSON), &wrapped); err != nil {
		return nil, fmt.Errorf("unmarshal wrapped response: %w", err)
	}

	return &wrapped, nil
}

// extractJSON strips markdown code fences and finds the outermost JSON object.
func extractJSON(raw string) string {
	raw = strings.TrimSpace(raw)

	// Strip ```json ... ``` or ``` ... ``` fences
	if strings.HasPrefix(raw, "```") {
		raw = strings.TrimPrefix(raw, "```json")
		raw = strings.TrimPrefix(raw, "```")
		if idx := strings.LastIndex(raw, "```"); idx != -1 {
			raw = raw[:idx]
		}
		raw = strings.TrimSpace(raw)
	}

	// Hard fallback: scan for outermost { ... }
	start := strings.Index(raw, "{")
	end := strings.LastIndex(raw, "}")
	if start != -1 && end != -1 && end > start {
		return raw[start : end+1]
	}

	return raw
}
