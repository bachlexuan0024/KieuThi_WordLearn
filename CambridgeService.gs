/**
 * ==========================================================
 * CambridgeService.gs
 * Cambridge Dictionary Service
 * ==========================================================
 */

const CambridgeService = (() => {

  /**
   * Lookup one word
   */
  function lookup(word) {

    word = Utils.lower(word);

    if (Utils.isEmpty(word)) {

      return errorResult(
        "Empty word"
      );

    }

    //---------------------------------------
    // Cache
    //---------------------------------------

    const cached =
      Cache.get(word);

    if (cached) {

      cached.fromCache = true;

      return cached;

    }

    //---------------------------------------
    // Fetch
    //---------------------------------------

    const response =
      Fetcher.getWord(word);

    if (!response.success) {

      return errorResult(
        "HTTP " + response.status
      );

    }

    if (response.notFound) {

      return notFound(word);

    }

    if (response.blocked) {

      return errorResult(
        "Blocked"
      );

    }

    //---------------------------------------
    // Parse
    //---------------------------------------

    const data =
      Parser.parse(
        response.html
      );

    data.word = word;

    data.url =
      response.url;

    data.updated =
      new Date();

    data.fromCache =
      false;

    //---------------------------------------
    // Validation
    //---------------------------------------

    if (

      !data.entries ||

      data.entries.length === 0

    ) {

      return errorResult(
        "Parser returned empty result"
      );

    }

    //---------------------------------------
    // Save Cache
    //---------------------------------------

    Cache.save(
      word,
      data
    );

    return data;

  }

  //------------------------------------------------

  function notFound(word){

      return{

          word,

          notFound:true,

          entries:[],

          url:
            VOCAB_CONFIG.CAMBRIDGE.BASE_URL+
            word

      };

  }

  //------------------------------------------------

  function errorResult(message){

      return{

          error:true,

          message,

          entries:[]

      };

  }

  //------------------------------------------------

  return{

      lookup

  };

})();