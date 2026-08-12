/**
 * ==========================================================
 * Gemini.gs
 * Gemini Pattern Generator
 * ==========================================================
 */

function getGeminiApiKey_() {
  const key = PropertiesService
    .getScriptProperties()
    .getProperty("GEMINI_API_KEY");

  if (!key) {
    throw new Error(
      "Chưa cấu hình GEMINI_API_KEY trong Script Properties."
    );
  }

  return key;
}


/**
 * Gọi Gemini để lấy grammatical patterns
 */
function getPatternsFromGemini_(word) {

  const apiKey = getGeminiApiKey_();

  const url =
    PATTERN_CONFIG.API_URL +
    PATTERN_CONFIG.MODEL +
    ":generateContent";


  const prompt = `
You are an expert English grammar and usage dictionary.

Your task is to identify the most important and useful grammatical
patterns for the English word below.

WORD:
${word}

For every pattern, provide:
1. The grammatical pattern.
2. A short Vietnamese meaning explaining how the pattern is used.

IMPORTANT:
The Vietnamese meaning must explain the meaning/function of the
whole pattern, not simply translate the individual words.

Use these notation rules:

S = Subject
O = Object
N = Noun
V = Base verb
V-ing = Verb ending in -ing
V3 = Past participle
Adj = Adjective
Adv = Adverb

Examples:

will:
S + will + V
S + will + be + N/Adj
S + will + be + V-ing
S + will + have + V3

want:
want + N
want + to V
want + O + to V

avoid:
avoid + N
avoid + V-ing

depend:
depend on + N

make:
make + N
make + O + V

For example:

make + O + V
Vietnamese meaning:
"bắt/ép ai làm gì"

want + O + to V
Vietnamese meaning:
"muốn ai làm gì"

avoid + V-ing
Vietnamese meaning:
"tránh làm gì"

depend on + N
Vietnamese meaning:
"phụ thuộc vào cái gì/ai"

Rules:

1. Return only genuinely useful and common grammatical patterns.
2. Do not return ordinary example sentences.
3. Do not invent rare or unnatural patterns.
4. Prefer patterns useful for English learners.
5. Preserve required prepositions such as:
   on, in, at, for, to, with, from, etc.
6. Do not use "something", "somebody", "a person", etc.
7. Maximum ${PATTERN_CONFIG.MAX_PATTERNS} patterns.
8. Sort patterns from most common/useful to less common.
9. If the word has multiple important parts of speech,
   include important patterns from those parts of speech.
10. Every pattern must have a concise Vietnamese explanation.
11. The explanation should normally be 3-10 Vietnamese words.
12. Do not put example sentences in the explanation.
13. Do not translate the pattern word-for-word.
14. Explain what the pattern means when actually used.

Return the result using the required JSON schema.
`;


  const schema = {
    type: "object",

    properties: {

      word: {
        type: "string"
      },

      part_of_speech: {
        type: "array",
        items: {
          type: "string"
        }
      },

      patterns: {
        type: "array",
        items: {
          type: "object",
          properties: {
            pattern: {
              type: "string"
            },
            meaning: {
              type: "string"
            }
          },
          required: [
            "pattern",
            "meaning"
          ]
        }
      }

    },

    required: [
      "word",
      "part_of_speech",
      "patterns"
    ]
  };


  const payload = {

    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],

    generationConfig: {

      responseMimeType: "application/json",

      responseSchema: schema,

      temperature: 0.2

    }

  };


  const response = UrlFetchApp.fetch(
    url,
    {
      method: "post",

      contentType: "application/json",

      headers: {
        "x-goog-api-key": apiKey
      },

      payload: JSON.stringify(payload),

      muteHttpExceptions: true

    }
  );


  const statusCode = response.getResponseCode();

  const responseText = response.getContentText();


  if (statusCode < 200 || statusCode >= 300) {

    throw new Error(
      "Gemini API error " +
      statusCode +
      ": " +
      responseText
    );

  }


  const data = JSON.parse(responseText);


  if (
    !data.candidates ||
    !data.candidates.length ||
    !data.candidates[0].content ||
    !data.candidates[0].content.parts
  ) {

    throw new Error(
      "Gemini không trả về dữ liệu hợp lệ: " +
      responseText
    );

  }


  const text =
    data.candidates[0]
      .content
      .parts[0]
      .text;


  const result = JSON.parse(text);


  return result;
}