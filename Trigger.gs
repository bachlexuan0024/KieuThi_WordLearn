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
    if (sheet.getName() !== PATTERN_CONFIG.SHEET_NAME) {
      return;
    }


    // Chỉ chạy khi sửa cột WORD
    if (
      range.getColumn() !== PATTERN_CONFIG.WORD_COLUMN
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
          PATTERN_CONFIG.PATTERN_COLUMN
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
        .map(item => {

          const pattern =
            String(item.pattern || "").trim();

          const meaning =
            String(item.meaning || "").trim();

          if (!pattern) return "";

          if (!meaning) {
            return pattern;
          }

          return pattern + " (" + meaning + ")";

        })
        .filter(Boolean)
        .slice(0, PATTERN_CONFIG.MAX_PATTERNS);


    // Không có pattern
    if (!patterns.length) {

      sheet
        .getRange(
          range.getRow(),
          PATTERN_CONFIG.PATTERN_COLUMN
        )
        .setValue("");

      return;
    }


    // Ghép bằng |
    const output = patterns.join(" || ");

    const outputRange = sheet.getRange(
      range.getRow(),
      PATTERN_CONFIG.PATTERN_COLUMN
    );

    // Tạo Rich Text
    const richTextBuilder =
      SpreadsheetApp.newRichTextValue()
        .setText(output);

    // Tìm tất cả vị trí của từ cần tìm
    const wordLower = word.toLowerCase();
    const outputLower = output.toLowerCase();

    let searchStart = 0;

    while (true) {

      const index =
        outputLower.indexOf(
          wordLower,
          searchStart
        );

      if (index === -1) break;

      richTextBuilder.setTextStyle(
        index,
        index + word.length,
        SpreadsheetApp.newTextStyle()
          .setBold(true)
          .build()
      );

      searchStart =
        index + word.length;
    }

    // Ghi Rich Text vào ô
    outputRange.setRichTextValue(
      richTextBuilder.build()
    );


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
          PATTERN_CONFIG.PATTERN_COLUMN
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