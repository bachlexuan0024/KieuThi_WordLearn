/**
 * ==========================================================
 * PATTERN_CONFIG.gs
 * Gemini Pattern Project
 * ==========================================================
 */

const PATTERN_CONFIG = {
  SHEET_NAME: "UsagePattern",

  WORD_COLUMN: 1,
  PATTERN_COLUMN: 2,

  // Gemini API
  MODEL: "openai/gpt-oss-20b",

  API_URL:
    "https://api.groq.com/openai/v1/chat/completions",

  // Số pattern tối đa cho một từ
  MAX_PATTERNS: 20
};