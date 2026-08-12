/**
 * ==========================================================
 * Trigger.gs
 * Google Sheets Trigger
 * ==========================================================
 */

function handleWordEdit(e) {

  try {

    if (!e || !e.range) return;


    const range = e.range;
    const sheet = range.getSheet();


    // Chỉ chạy đúng sheet
    if (sheet.getName() !== CONFIG.SHEET_NAME) {
      return;
    }


    // Chỉ chạy khi sửa cột WORD
    if (
      range.getColumn() !== CONFIG.WORD_COLUMN
    ) {
      return;
    }


    // Không xử lý header
    if (range.getRow() === 1) {
      return;
    }


    const word =
      String(range.getValue())
        .trim();


    // Nếu xóa từ thì xóa pattern
    if (!word) {

      sheet
        .getRange(
          range.getRow(),
          CONFIG.PATTERN_COLUMN
        )
        .clearContent();

      return;
    }


    // Gọi Gemini
    const result =
      getPatternsFromGemini_(word);


    // Kiểm tra kết quả
    if (
      !result ||
      !Array.isArray(result.patterns)
    ) {

      throw new Error(
        "Gemini không trả về patterns hợp lệ."
      );

    }


    // Làm sạch pattern
    const patterns =
      result.patterns
        .map(p => String(p).trim())
        .filter(Boolean)
        .slice(0, CONFIG.MAX_PATTERNS);


    // Không có pattern
    if (!patterns.length) {

      sheet
        .getRange(
          range.getRow(),
          CONFIG.PATTERN_COLUMN
        )
        .setValue("");

      return;
    }


    // Ghép bằng |
    const output =
      patterns.join(" | ");


    // Ghi vào Sheet
    sheet
      .getRange(
        range.getRow(),
        CONFIG.PATTERN_COLUMN
      )
      .setValue(output);


  } catch (error) {

    const row =
      e && e.range
        ? e.range.getRow()
        : null;


    if (row) {

      e.range
        .getSheet()
        .getRange(
          row,
          CONFIG.PATTERN_COLUMN
        )
        .setValue(
          "ERROR: " + error.message
        );

    }

    console.error(error);

  }

}

function createTrigger() {

  ScriptApp
    .newTrigger("handleWordEdit")
    .forSpreadsheet(
      SpreadsheetApp.getActive()
    )
    .onEdit()
    .create();

}