/**
 * ==========================================================
 * Cambridge Dictionary
 * Utils.gs
 * Common helper functions
 * ==========================================================
 */

const Utils = (() => {

  /**
   * Remove HTML tags
   */
  function stripTags(html) {

    if (!html) return "";

    return html.replace(/<[^>]*>/g, "");

  }

  /**
   * Decode common HTML entities
   */
  function decodeHtml(text) {

    if (!text) return "";

    return text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

  }

  /**
   * Normalize spaces
   */
  function normalize(text) {

    if (!text) return "";

    return text
      .replace(/\s+/g, " ")
      .trim();

  }

  /**
   * HTML → Plain text
   */
  function htmlToText(html) {

    return normalize(
      decodeHtml(
        stripTags(html)
      )
    );

  }

  /**
   * Safe lowercase
   */
  function lower(text) {

    return String(text || "")
      .trim()
      .toLowerCase();

  }

  /**
   * Empty?
   */
  function isEmpty(value) {

    return value === null ||
           value === undefined ||
           value === "";

  }

  /**
   * First regex match
   */
  function first(regex, html) {

    const m = html.match(regex);

    return m ? m[1] : "";

  }

  /**
   * All regex matches
   */
  function all(regex, html) {

    return [...html.matchAll(regex)];

  }

  /**
   * Remove duplicate strings
   */
  function unique(array) {

    return [...new Set(array)];

  }

  /**
   * Safe JSON parse
   */
  function parseJson(text) {

    try {

      return JSON.parse(text);

    } catch (e) {

      return null;

    }

  }

  /**
   * Safe sleep
   */
  function sleep(ms) {

    Utilities.sleep(ms);

  }

  /**
   * Logger
   */
  function log(title, value) {

    Logger.log(
      "[" + title + "]\n" +
      JSON.stringify(value, null, 2)
    );

  }

  /**
   * Remove empty array items
   */
  function compact(array) {

    return array.filter(Boolean);

  }

  /**
   * Safe substring
   */
  function between(text, start, end) {

    const s = text.indexOf(start);

    if (s < 0) return "";

    const e = text.indexOf(
      end,
      s + start.length
    );

    if (e < 0) return "";

    return text.substring(
      s + start.length,
      e
    );

  }

  /**
   * Escape regex
   */
  function escapeRegex(text) {

    return text.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  }

  return {

    stripTags,

    decodeHtml,

    normalize,

    htmlToText,

    lower,

    isEmpty,

    first,

    all,

    unique,

    parseJson,

    sleep,

    log,

    compact,

    between,

    escapeRegex

  };

})();