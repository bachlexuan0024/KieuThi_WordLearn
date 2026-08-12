/**
 * ==========================================================
 * Config.gs
 * Gemini Pattern Project
 * ==========================================================
 */

const CONFIG = {
  SHEET_NAME: "UsagePattern",

  WORD_COLUMN: 1,
  PATTERN_COLUMN: 2,

  // Gemini API
  MODEL: "gemini-3.5-flash",

  API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/",

  // Số pattern tối đa cho một từ
  MAX_PATTERNS: 6
};