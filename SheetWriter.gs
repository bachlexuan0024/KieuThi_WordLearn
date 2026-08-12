/**
 * ==========================================================
 * SheetWriter.gs
 * Write dictionary result to Google Sheet
 * ==========================================================
 */

const SheetWriter = (() => {

  //----------------------------------------------------------

  function write(sheet, row, result) {

    if (!sheet)
      return;

    if (!result)
      return;

    if (result.notFound) {

      write404(sheet, row);

      return;

    }

    if (result.error) {

      writeError(
        sheet,
        row,
        result.message
      );

      return;

    }

    const entry =
      result.entries[0] || {};

    //------------------------------------
    // Definition
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.DEFINITION
      )
      .setValue(
        entry.definition || ""
      );

    //------------------------------------
    // Vietnamese
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.VIETNAMESE
      )
      .setValue(
        Translator.translate(
          result.word,
          entry.definition || ""
        )
      );

    //------------------------------------
    // Example
    //------------------------------------

    writeExample(

      sheet,

      row,

      entry.example || "",

      result.word

    );

    //------------------------------------
    // IPA
    //------------------------------------

    // sheet
    //   .getRange(
    //     row,
    //     VOCAB_CONFIG.COLUMN.IPA_UK
    //   )
    //   .setValue(
    //     result.ukIPA || ""
    //   );

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.IPA_US
      )
      .setValue(
        result.usIPA || ""
      );

    //------------------------------------
    // POS
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.POS
      )
      .setValue(
        result.pos || ""
      );

    //------------------------------------
    // LEVEL
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.LEVEL
      )
      .setValue(
        result.level || ""
      );

    //------------------------------------
    // LINK
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.LINK
      )
      .setRichTextValue(

        SpreadsheetApp

          .newRichTextValue()

          .setText("Learn More")

          .setLinkUrl(
            result.url
          )

          .build()

      );

    //------------------------------------
    // COLLOCATION
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.COLLOCATION
      )
      .setValue(
        result.collocation || ""
      );

    //------------------------------------
    // SYNONYM
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.SYNONYM
      )
      .setValue(
        result.synonym || ""
      );

    //------------------------------------
    // STATUS
    //------------------------------------

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.STATUS
      )
      .setValue(
        VOCAB_CONFIG.STATUS.NEW
      );

  }

  //----------------------------------------------------------

  function writeExample(

    sheet,

    row,

    sentence,

    word

  ){

    const builder =
      SpreadsheetApp
        .newRichTextValue()
        .setText(sentence);

    const regex =
      new RegExp(
        "\\b" +
        Utils.escapeRegex(word) +
        "\\b",
        "gi"
      );

    let match;

    while (
      (match = regex.exec(sentence)) !== null
    ) {

      builder.setTextStyle(

        match.index,

        match.index + match[0].length,

        SpreadsheetApp

          .newTextStyle()

          .setBold(true)

          .build()

      );

    }

    sheet
      .getRange(
        row,
        VOCAB_CONFIG.COLUMN.EXAMPLE
      )
      .setRichTextValue(
        builder.build()
      );

  }

  //----------------------------------------------------------

  function write404(sheet,row){

      clear(sheet,row);

      sheet
        .getRange(

          row,

          VOCAB_CONFIG.COLUMN.STATUS

        )
        .setValue(
          VOCAB_CONFIG.STATUS.NOT_FOUND
        );

  }

  //----------------------------------------------------------

  function writeError(

      sheet,

      row,

      message

  ){

      clear(sheet,row);

      sheet
        .getRange(

          row,

          VOCAB_CONFIG.COLUMN.STATUS

        )
        .setValue(message);

  }

  //----------------------------------------------------------

  function clear(sheet,row){

      sheet
        .getRange(

          row,

          VOCAB_CONFIG.COLUMN.DEFINITION,

          1,

          VOCAB_CONFIG.COLUMN.STATUS-
          VOCAB_CONFIG.COLUMN.DEFINITION+1

        )
        .clearContent();

  }

  //----------------------------------------------------------

  return{

      write,

      clear

  };

})();