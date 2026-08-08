/**
 * ==========================================================
 * Cache.gs
 * Cambridge Dictionary Cache Manager
 * ==========================================================
 */

const Cache = (() => {

  const memory =
    CacheService.getScriptCache();

  // --------------------------------------------------
  // PUBLIC
  // --------------------------------------------------

  function get(word) {

    word = Utils.lower(word);

    // Level 1
    const mem =
      memory.get(word);

    if (mem) {

      const obj =
        Utils.parseJson(mem);

      if (obj)
        return obj;

    }

    // Level 2
    const sheet =
      getCacheSheet();

    const values =
      sheet.getDataRange()
        .getValues();

    for (let i = 1; i < values.length; i++) {

      if (
        Utils.lower(values[i][0]) === word
      ) {

        const json =
          values[i][2];

        const obj =
          Utils.parseJson(json);

        if (obj) {

          memory.put(
            word,
            json,
            CONFIG.CACHE.EXPIRE_SECONDS
          );

          return obj;

        }

      }

    }

    return null;

  }

  // --------------------------------------------------

  function save(word, object) {

    word =
      Utils.lower(word);

    const json =
      JSON.stringify(object);

    memory.put(

      word,

      json,

      CONFIG.CACHE.EXPIRE_SECONDS

    );

    const sheet =
      getCacheSheet();

    const values =
      sheet.getDataRange()
        .getValues();

    for (let i = 1; i < values.length; i++) {

      if (
        Utils.lower(values[i][0]) === word
      ) {

        sheet
          .getRange(i + 1, 2)
          .setValue(new Date());

        sheet
          .getRange(i + 1, 3)
          .setValue(json);

        return;

      }

    }

    sheet.appendRow([

      word,

      new Date(),

      json

    ]);

  }

  // --------------------------------------------------

  function remove(word) {

    word =
      Utils.lower(word);

    memory.remove(word);

    const sheet =
      getCacheSheet();

    const values =
      sheet.getDataRange()
        .getValues();

    for (let i = values.length - 1; i >= 1; i--) {

      if (
        Utils.lower(values[i][0]) === word
      ) {

        sheet.deleteRow(i + 1);

      }

    }

  }

  // --------------------------------------------------

  function clear() {

    // Clear Level 1: Script Cache
    memory.removeAll(
      getCacheWords()
    );

    // Clear Level 2: Sheet Cache
    const sheet =
      getCacheSheet();

    if (
      sheet.getLastRow() > 1
    ) {

      sheet
        .getRange(
          2,
          1,
          sheet.getLastRow() - 1,
          3
        )
        .clearContent();

    }

  }

  // --------------------------------------------------

  function getCacheWords() {

  const sheet =
    getCacheSheet();

  if (sheet.getLastRow() <= 1)
    return [];

  return sheet
    .getRange(
      2,
      1,
      sheet.getLastRow() - 1,
      1
    )
    .getValues()
    .map(row =>
      Utils.lower(row[0])
    )
    .filter(Boolean);

}

  // --------------------------------------------------

  function getCacheSheet() {

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();

    let sheet =
      ss.getSheetByName(
        CONFIG.SHEET.CACHE_NAME
      );

    if (!sheet) {

      sheet =
        ss.insertSheet(
          CONFIG.SHEET.CACHE_NAME
        );

      sheet.hideSheet();

      sheet.appendRow([

        "Word",

        "Updated",

        "JSON"

      ]);

    }

    return sheet;

  }

  // --------------------------------------------------

  return {

    get,

    save,

    remove,

    clear

  };

})();