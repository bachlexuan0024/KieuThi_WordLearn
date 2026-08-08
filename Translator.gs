/**
 * ==========================================================
 * Translator.gs
 * Translation Service
 * English → Vietnamese
 * ==========================================================
 */

const Translator = (() => {

  /**
   * Translate word + definition
   *
   * Format:
   * English word | English definition
   *
   * Result:
   * Vietnamese word | Vietnamese definition
   */
  function translate(word, definition) {

    word =
      String(word || "").trim();

    definition =
      String(definition || "").trim();

    if (
      Utils.isEmpty(word) &&
      Utils.isEmpty(definition)
    ) {

      return "";

    }

    const text =
      word + " | " + definition;

    try {

      const result =
        LanguageApp.translate(
          text,
          "en",
          "vi"
        );

      return Utils.normalize(result);

    }

    catch (err) {

      Logger.log(
        "[Translator] " +
        err.toString()
      );

      return "";

    }

  }

  return {

    translate

  };

})();