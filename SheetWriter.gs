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
        CONFIG.COLUMN.DEFINITION
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
        CONFIG.COLUMN.VIETNAMESE
      )
      .setValue(
        // Translator.translate(
        //   entry.definition || ""
        // )
        entry.definition
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

    sheet
      .getRange(
        row,
        CONFIG.COLUMN.IPA_UK
      )
      .setValue(
        result.ukIPA || ""
      );

    sheet
      .getRange(
        row,
        CONFIG.COLUMN.IPA_US
      )
      .setValue(
        result.usIPA || ""
      );

    //------------------------------------
    // Audio
    //------------------------------------

    sheet
      .getRange(
        row,
        CONFIG.COLUMN.AUDIO_UK
      )
      .setValue(
        result.audioUK || ""
      );

    sheet
      .getRange(
        row,
        CONFIG.COLUMN.AUDIO_US
      )
      .setValue(
        result.audioUS || ""
      );

    //------------------------------------
    // POS
    //------------------------------------

    sheet
      .getRange(
        row,
        CONFIG.COLUMN.POS
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
        CONFIG.COLUMN.LEVEL
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
        CONFIG.COLUMN.LINK
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
    // STATUS
    //------------------------------------

    sheet
      .getRange(
        row,
        CONFIG.COLUMN.STATUS
      )
      .setValue(
        CONFIG.STATUS.NEW
      );

  }

  //----------------------------------------------------------

  function writeExample(

    sheet,

    row,

    sentence,

    word

  ){

      const builder=

        SpreadsheetApp
          .newRichTextValue()
          .setText(sentence);

      const start=
        sentence
          .toLowerCase()
          .indexOf(
            word.toLowerCase()
          );

      if(start>=0){

          builder.setTextStyle(

              start,

              start+word.length,

              SpreadsheetApp

                  .newTextStyle()

                  .setBold(true)

                  .build()

          );

      }

      sheet
        .getRange(

          row,

          CONFIG.COLUMN.EXAMPLE

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

          CONFIG.COLUMN.STATUS

        )
        .setValue(
          CONFIG.STATUS.NOT_FOUND
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

          CONFIG.COLUMN.STATUS

        )
        .setValue(message);

  }

  //----------------------------------------------------------

  function clear(sheet,row){

      sheet
        .getRange(

          row,

          CONFIG.COLUMN.DEFINITION,

          1,

          CONFIG.COLUMN.STATUS-
          CONFIG.COLUMN.DEFINITION+1

        )
        .clearContent();

  }

  //----------------------------------------------------------

  return{

      write,

      clear

  };

})();