/**
 * ==========================================================
 * Translator.gs
 * Translation Service
 * ==========================================================
 */

const Translator = (() => {

  /**
   * Translate English → Vietnamese
   */
  function translate(text) {

    if (Utils.isEmpty(text))
      return "";

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