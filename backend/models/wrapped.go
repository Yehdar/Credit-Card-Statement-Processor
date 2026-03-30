package models

// WrappedResponse is the top-level payload returned to the frontend.
type WrappedResponse struct {
	MetaData      MetaData      `json:"meta_data"`
	StatsSummary  StatsSummary  `json:"stats_summary"`
	WrappedSlides []Slide       `json:"wrapped_slides"`
	RewardsEngine RewardsEngine `json:"rewards_engine"`
}

type MetaData struct {
	AccountHolder *string `json:"account_holder"`
	PersonaTitle  string  `json:"persona_title"`
	VibeCheck     string  `json:"vibe_check"`
}

type StatsSummary struct {
	TotalSpent       float64 `json:"total_spent"`
	TopCategory      string  `json:"top_category"`
	TransactionCount int     `json:"transaction_count"`
}

// Slide covers all slide_type variants (top_merchant, night_owl, big_flex).
type Slide struct {
	SlideType string `json:"slide_type"`
	Headline  string `json:"headline"`
	MainStat  string `json:"main_stat"`
	Context   string `json:"context"`
}

type RewardsEngine struct {
	PointsEarned    int    `json:"points_earned"`
	MissedBag       int    `json:"missed_bag"`
	OptimizationTip string `json:"optimization_tip"`
}

// AnalyzeRequest is the body POSTed by the frontend.
type AnalyzeRequest struct {
	StatementText string `json:"statement_text"`
}

// AnalyzeResponse wraps the result with an optional error envelope.
type AnalyzeResponse struct {
	Data  *WrappedResponse `json:"data,omitempty"`
	Error string           `json:"error,omitempty"`
}
