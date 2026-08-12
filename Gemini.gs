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
    CONFIG.API_URL +
    CONFIG.MODEL +
    ":generateContent";


  const prompt = `
You are an expert English grammar and usage dictionary.

Your task is to identify the most important and useful grammatical
patterns for the English word below.

WORD:
${word}

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
S + want + N
S + want + to V
S + want + O + to V

avoid:
S + avoid + N
S + avoid + V-ing

depend:
S + depend on + N

Rules:

1. Return only genuinely useful grammatical patterns.
2. Do not return ordinary example sentences.
3. Do not invent rare or unnatural patterns.
4. Prefer common patterns used by English learners.
5. Preserve required prepositions such as:
   on, in, at, for, to, with, from, etc.
6. Include the word itself in every pattern.
7. Use S, O, N, V, V-ing, V3, Adj and Adv notation.
8. Do not use "something", "somebody", "a person", etc.
9. Maximum ${CONFIG.MAX_PATTERNS} patterns.
10. Sort patterns from most common/useful to less common.
11. If the word has multiple important parts of speech,
    include patterns for the important ones.
12. Do not provide explanations outside the requested JSON.
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
          type: "string"
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