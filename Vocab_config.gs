/**
 * ==========================================================
 * Cambridge Dictionary
 * VOCAB_CONFIG.gs
 * Global configuration
 * ==========================================================
 */

const VOCAB_CONFIG = {
  
  SHEET_NAME: "Vocabulary",

  VERSION: "2.0.0",

  CAMBRIDGE: {

    BASE_URL:
      "https://dictionary.cambridge.org/dictionary/english/",

    USER_AGENT:
      "Mozilla/5.0",

    TIMEOUT: 30000

  },

  CACHE: {

    ENABLED: true,

    EXPIRE_SECONDS: 21600

  },

  SHEET: {

    CACHE_NAME: "_CAM_CACHE",

    SETTINGS_NAME: "_CAM_SETTINGS"

  },

  COLUMN: {

    WORD: 1,

    MANUAL: 2,

    DEFINITION: 3,

    VIETNAMESE: 4,

    EXAMPLE: 5,

    // IPA_UK: 6,

    IPA_US: 6,

    POS: 7,

    LEVEL: 8,

    LINK: 9,

    COLLOCATION: 10,

    SYNONYM: 11,

    STATUS: 12

  },

  STATUS: {

    NEW: "New",

    UPDATED: "Updated",

    NOT_FOUND: "404 Not Found"

  }

};