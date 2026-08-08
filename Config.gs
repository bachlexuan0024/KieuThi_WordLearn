/**
 * ==========================================================
 * Cambridge Dictionary
 * Config.gs
 * Global configuration
 * ==========================================================
 */

const CONFIG = {

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

    IPA_UK: 6,

    IPA_US: 7,

    POS: 8,

    LEVEL: 9,

    LINK: 10,

    STATUS: 11

  },

  STATUS: {

    NEW: "New",

    UPDATED: "Updated",

    NOT_FOUND: "404 Not Found"

  }

};