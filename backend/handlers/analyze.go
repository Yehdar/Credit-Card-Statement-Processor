package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Yehdar/Credit-Card-Statement-Processor/backend/gemini"
	"github.com/Yehdar/Credit-Card-Statement-Processor/backend/models"
)

// Analyze handles POST /api/analyze.
func Analyze(apiKey string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// Limit request body to 50KB
		r.Body = http.MaxBytesReader(w, r.Body, 50*1024)

		var req models.AnalyzeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body: "+err.Error())
			return
		}

		req.StatementText = strings.TrimSpace(req.StatementText)
		if req.StatementText == "" {
			writeError(w, http.StatusBadRequest, "statement_text must not be empty")
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 50*time.Second)
		defer cancel()

		wrapped, err := gemini.Analyze(ctx, apiKey, req.StatementText)
		if err != nil {
			writeError(w, http.StatusBadGateway, "gemini error: "+err.Error())
			return
		}

		writeJSON(w, http.StatusOK, models.AnalyzeResponse{Data: wrapped})
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(models.AnalyzeResponse{Error: msg})
}
