/**
 * ==========================================================
 * Trigger.gs
 * Google Sheets Triggers
 * ==========================================================
 */

function onEdit(e) {

  try {

    if (!e || !e.range) return;

    const sheet = e.range.getSheet();

    // Chỉ chạy sheet Vocabulary
    if (
      sheet.getName() !== VOCAB_CONFIG.SHEET_NAME
    ) {
      return;
    }

    const row = e.range.getRow();
    const col = e.range.getColumn();

    // Header
    if (row === 1)
      return;

    // Only column A
    if (col !== VOCAB_CONFIG.COLUMN.WORD)
      return;

    const word = String(
      e.range.getValue() || ""
    ).trim();

    // Empty
    if (!word) {

      SheetWriter.clear(
        sheet,
        row
      );

      return;
    }

    // Lookup
    const result =
      CambridgeService.lookup(
        word
      );

    // Write
    SheetWriter.write(
      sheet,
      row,
      result
    );

  } catch (err) {

    Logger.log(err);

  }

}