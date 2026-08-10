/**
 * ==========================================================
 * Parser.gs
 * Cambridge Dictionary HTML Parser
 * Version 2.0
 * ==========================================================
 */

const Parser = (() => {

  /**
   * Public
   */
  function parse(html) {

    html = Utils.normalize(html);

    const result = {

      word: "",

      // ukIPA: "",

      usIPA: "",

      pos: "",

      level: "",

      collocation: "",

      synonym: "",

      entries: []

    };

    result.word =
      parseWord(html);

    // result.ukIPA =
    //   parseIPA(html, "uk");

    result.usIPA =
      parseIPA(html, "us");

    result.pos =
      parsePOS(html);

    result.level =
      parseLevel(html);

    result.entries =
      parseEntries(html);

    result.collocation =
      parseCollocations(html);

    result.synonym =
      parseSynonyms(html);

    return result;

  }

  // -----------------------------------------------------
  // Word
  // -----------------------------------------------------

  function parseWord(html) {

    return Utils.htmlToText(

      extractSingle(

        html,

        'class="hw dhw"',

        "</span>"

      )

    );

  }

  // -----------------------------------------------------
  // IPA
  // -----------------------------------------------------

  function parseIPA(html, type) {

    let start;

    if (type === "us") {

      start =
        'us dpron-i';

    }

    else {

      start =
        'uk dpron-i';

    }

    const block =
      extractSection(

        html,

        start,

        '</span></span>'

      );

    return Utils.htmlToText(

      extractSingle(

        block,

        'class="ipa dipa lpr-2 lpl-1">',

        "</span>"

      )

    );

  }

  // -----------------------------------------------------
  // POS
  // -----------------------------------------------------

  function parsePOS(html) {

    /*
    * Cambridge may render POS inside the first entry block
    * using different class names. We use a regex fallback
    * so both older and newer markup work.
    */

    const entryStart =
      html.indexOf(
        '<div class="pr entry-body__el">'
      );

    if (entryStart < 0)
      return "";

    const entryEnd =
      html.indexOf(
        '<div class="pr entry-body__el">',
        entryStart + 1
      );

    const entry =
      entryEnd >= 0
        ? html.substring(
            entryStart,
            entryEnd
          )
        : html.substring(entryStart);

    const posMatch =
      entry.match(
        /class="[^"]*pos[^"]*"[^>]*>([^<]+)/i
      );

    if (!posMatch)
      return "";

    return Utils.htmlToText(
      posMatch[1]
    );

  }

  // -----------------------------------------------------
  // Level
  // -----------------------------------------------------

  function parseLevel(html) {

    /*
    * CEFR level is stored in:
    *
    * <span class="epp-xref dxref B2">B2</span>
    *
    * It belongs to the definition block.
    */

    const entryStart =
      html.indexOf(
        '<div class="pr entry-body__el">'
      );

    if (entryStart < 0)
      return "";

    const entryEnd =
      html.indexOf(
        '<div class="pr entry-body__el">',
        entryStart + 1
      );

    const entry =
      entryEnd >= 0
        ? html.substring(
            entryStart,
            entryEnd
          )
        : html.substring(entryStart);

    const levelMatch =
      entry.match(
        /class="[^"]*dxref[^"]*"[^>]*>([^<]+)/i
      );

    if (!levelMatch)
      return "";

    const level = Utils.htmlToText(
      levelMatch[1]
    ).trim().toUpperCase();

    return /^(A1|A2|B1|B2|C1|C2)$/.test(level)
      ? level
      : "";

  }

  // -----------------------------------------------------
  // Entries
  // -----------------------------------------------------

  function parseEntries(html) {

    const entries = [];

    const entryStart =
      html.indexOf(
        '<div class="pr entry-body__el">'
      );

    if (entryStart < 0)
      return entries;

    const entryEnd =
      html.indexOf(
        '<div class="pr entry-body__el">',
        entryStart + 1
      );

    const entry =
      entryEnd >= 0
        ? html.substring(
            entryStart,
            entryEnd
          )
        : html.substring(entryStart);

    const blocks =
      splitByClass(
        entry,
        "def-block"
      );

    blocks.forEach(

      block => {

        const obj = {

          definition:
            parseDefinition(block),

          example:
            parseExample(block)

        };

        if (obj.definition) {

          entries.push(obj);

        }

      }

    );

    return entries;

  }

  // -----------------------------------------------------
  // Collocations
  // -----------------------------------------------------

  function parseCollocations(html) {

    const section =
      extractSection(

        html,

        'data-id="combinations"',

        '</div></div></div>'

      );

    if (!section) {

      return "";

    }

    const values = [];

    /*
     * Cambridge combination links are normally
     * example/english/... links inside the
     * "combinations" dataset.
     */

    const regex =
      /<a[^>]+href="https:\/\/dictionary\.cambridge\.org\/example\/english\/[^"]+"[^>]*>([\s\S]*?)<\/a>/gi;

    let match;

    while (
      (match = regex.exec(section)) !== null
    ) {

      const text =
        Utils.htmlToText(match[1]);

      if (text) {

        values.push(text);

      }

    }

    return Utils
      .unique(values)
      .join(" | ");

  }

  // -----------------------------------------------------
  // Synonyms / Thesaurus
  // -----------------------------------------------------

  function parseSynonyms(html) {

    const section =
      extractSection(

        html,

        "Thesaurus: synonyms, antonyms, and examples",

        "</amp-accordion>"

      );

    if (!section) {

      return "";

    }

    const values = [];

    /*
     * Only collect links pointing to the
     * Cambridge Thesaurus.
     */

    const regex =
      /<a[^>]+href="\/thesaurus\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

    let match;

    while (
      (match = regex.exec(section)) !== null
    ) {

      const href =
        match[1];

      const text =
        Utils.htmlToText(match[2]);

      if (
        text &&
        !href.startsWith("articles/")
      ) {

        values.push(text);

      }

    }

    return Utils
      .unique(values)
      .join(" | ");

  }

  // -----------------------------------------------------
  // Definition
  // -----------------------------------------------------

  function parseDefinition(block) {

    const definition =
      Utils.htmlToText(

        extractSingle(

          block,

          'class="def ddef_d db">',

          "</div>"

        )

      );

    return definition
      .replace(/:\s*$/, "");

  }

  // -----------------------------------------------------
  // Example
  // -----------------------------------------------------

  function parseExample(block) {

    return extractAll(

      block,

      'class="eg deg">',

      "</span>"

    )

      .map(Utils.htmlToText)

      .filter(Boolean)

      .join(" | ");

  }

  // -----------------------------------------------------
  // Generic extractors
  // -----------------------------------------------------

  function extractSingle(
    html,
    start,
    end
  ) {

    const i =
      html.indexOf(start);

    if (i < 0)
      return "";

    const j =
      html.indexOf(
        end,
        i
      );

    if (j < 0)
      return "";

    return html.substring(

      i + start.length,

      j

    );

  }

  // -----------------------------------------------------

  function extractAll(
    html,
    start,
    end
  ) {

    const arr = [];

    let pos = 0;

    while (true) {

      const i =
        html.indexOf(
          start,
          pos
        );

      if (i < 0)
        break;

      const j =
        html.indexOf(
          end,
          i + start.length
        );

      if (j < 0)
        break;

      arr.push(

        html.substring(

          i + start.length,

          j

        )

      );

      pos =
        j + end.length;

    }

    return arr;

  }

  // -----------------------------------------------------

  function extractSection(
    html,
    start,
    end
  ) {

    const i =
      html.indexOf(start);

    if (i < 0)
      return "";

    const j =
      html.indexOf(
        end,
        i
      );

    if (j < 0)
      return "";

    return html.substring(
      i,
      j
    );

  }

  // -----------------------------------------------------

  function extractAttribute(
    html,
    attr
  ) {

    const i =
      html.indexOf(attr);

    if (i < 0)
      return "";

    const j =
      html.indexOf(
        '"',
        i + attr.length
      );

    return html.substring(
      i + attr.length,
      j
    );

  }

  // -----------------------------------------------------

  function splitByClass(
    html,
    className
  ) {

    const arr = [];

    const token =
      'class="' +
      className;

    let pos = 0;

    while (true) {

      const i =
        html.indexOf(
          token,
          pos
        );

      if (i < 0)
        break;

      const j =
        html.indexOf(
          token,
          i + 1
        );

      if (j < 0) {

        arr.push(
          html.substring(i)
        );

        break;

      }

      arr.push(
        html.substring(i, j)
      );

      pos = j;

    }

    return arr;

  }

  return {

    parse

  };

})();