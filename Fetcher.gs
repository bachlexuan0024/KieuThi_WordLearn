/**
 * ==========================================================
 * Cambridge Dictionary
 * Fetcher.gs
 * HTTP Client
 * ==========================================================
 */

const Fetcher = (() => {

  /**
   * Fetch Cambridge HTML
   */
  function getWord(word) {

    word = Utils.lower(word);

    const url =
      VOCAB_CONFIG.CAMBRIDGE.BASE_URL +
      encodeURIComponent(
        word.replace(/\s+/g, "-")
      );

    return request(url);

  }

  /**
   * Generic HTTP Request
   */
  function request(url) {

    const options = {

      muteHttpExceptions: true,

      followRedirects: true,

      headers: {

        "User-Agent":
          VOCAB_CONFIG.CAMBRIDGE.USER_AGENT,

        "Accept":
          "text/html",

        "Accept-Language":
          "en-US,en;q=0.9",

        "Cache-Control":
          "no-cache"

      }

    };

    try {

      const response =
        UrlFetchApp.fetch(
          url,
          options
        );

      return normalizeResponse(
        response,
        url
      );

    }

    catch(err){

      return {

        success:false,

        status:0,

        url:url,

        html:"",

        error:err.toString()

      };

    }

  }

  /**
   * Convert UrlFetch response
   */
  function normalizeResponse(response,url){

      const status =
        response.getResponseCode();

      const html =
        response.getContentText();

      return{

          success:
            status===200,

          status,

          url,

          html,

          blocked:
            detectBlocked(html),

          notFound:
            detect404(status,html),

          error:null

      };

  }

  /**
   * Cambridge 404
   */
  function detect404(status,html){

      if(status===404)
          return true;

      if(html.includes("Page Not Found"))
          return true;

      if(html.includes("No results"))
          return true;

      return false;

  }

  /**
   * Detect anti-bot page
   */
  function detectBlocked(html){

      const patterns=[

          "enable JavaScript",

          "Cloudflare",

          "Access denied",

          "captcha",

          "Attention Required"

      ];

      return patterns.some(p=>
          html.includes(p)
      );

  }

  return{

      getWord,

      request

  };

})();