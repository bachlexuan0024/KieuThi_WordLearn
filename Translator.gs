/**
 * ==========================================================
 * Translator.gs
 * Translation Service
 * Version 2.0
 * ==========================================================
 */

const Translator = (() => {

  /**
   * Public
   */
  function translate(text) {

    if (Utils.isEmpty(text))
      return "";

    return googleTranslate(text);

  }

  //--------------------------------------------------------

  function googleTranslate(text) {

    try {

      const url =
        "https://translate.googleapis.com/translate_a/single"
        + "?client=gtx"
        + "&sl=en"
        + "&tl=vi"
        + "&dt=t"
        + "&q="
        + encodeURIComponent(text);

      const response =
        UrlFetchApp.fetch(url);

      const json =
        JSON.parse(
          response.getContentText()
        );

      return collectText(json);

    }

    catch (err) {

      Logger.log(err);

      return "";

    }

  }

  //--------------------------------------------------------

  function collectText(json){

      if(!json)
          return "";

      if(!json[0])
          return "";

      let result="";

      json[0].forEach(part=>{

          if(part[0])
              result+=part[0];

      });

      return Utils.normalize(result);

  }

  //--------------------------------------------------------

  return{

      translate

  };

})();