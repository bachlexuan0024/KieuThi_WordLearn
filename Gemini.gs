/**
 * ==========================================================
 * Gemini.gs
 * Groq Pattern Generator
 * ==========================================================
 */


/**
 * ==========================================================
 * Get Groq API Key
 * ==========================================================
 */
function getGeminiApiKey_() {

  const key =
    PropertiesService
      .getScriptProperties()
      .getProperty("GROQ_API_KEY");

  if (!key) {
    throw new Error(
      "Chưa cấu hình GROQ_API_KEY trong Script Properties."
    );
  }

  return key;
}


/**
 * ==========================================================
 * Generate grammatical patterns using Groq
 * ==========================================================
 */
function getPatternsFromGemini_(word) {

  // ========================================================
  // Validate input
  // ========================================================

  if (!word || !String(word).trim()) {
    throw new Error("Word không hợp lệ.");
  }

  word = String(word).trim();


  // ========================================================
  // API configuration
  // ========================================================

  const apiKey = getGeminiApiKey_();

  const url = PATTERN_CONFIG.API_URL;


  // ========================================================
  // Prompt
  // ========================================================

  const prompt = `
You are an expert English grammar and usage dictionary.

Your task is to identify the most important, common, natural,
and useful grammatical patterns for the English word below.

WORD:
${word}


==============================================================
PATTERN DEFINITION
==============================================================

A grammatical pattern is a reusable structure showing how the
word normally behaves and is used in real English sentences.

A pattern must describe how the word combines with other
grammatical elements.

Do NOT limit patterns to simple affirmative sentence structures.

The goal is to describe the actual grammatical behavior and
common usage of the word.


==============================================================
NOTATION
==============================================================

Use these notation rules:

S = Subject
O = Object
N = Noun
V = Base verb
V-ing = Verb ending in -ing
V3 = Past participle
Adj = Adjective
Adv = Adverb

Use other grammatical labels when necessary, but keep patterns
simple and useful for English learners.


==============================================================
TYPES OF PATTERNS TO CONSIDER
==============================================================

Depending on the word, consider different structures such as:

- affirmative structures
- negative structures
- yes/no questions
- wh-questions
- imperative structures
- passive structures
- modal constructions
- infinitive constructions
- gerund constructions
- noun complements
- adjective complements
- object + complement structures
- object + infinitive structures
- object + base verb structures
- prepositional structures
- phrasal-verb structures
- clause structures
- that-clauses
- wh-clauses
- whether/if clauses
- common fixed constructions
- common idiomatic grammatical constructions
- patterns associated with different parts of speech


IMPORTANT:

Do NOT force every word to have all of these types.

Only include a type when it is genuinely natural, common,
and useful for understanding how the word is used.


==============================================================
VERB PATTERNS
==============================================================

For verbs, do not only generate patterns beginning with "S".

Consider whether the verb naturally occurs in structures such as:

S + V + O

S + V + to V

S + V + V-ing

S + V + O + to V

S + V + O + V

S + V + O + Adj

S + V + preposition + N

S + V + that-clause

S + V + wh-clause


Also consider question structures when they are genuinely
common and useful:

Do/Does/Did + S + V ...?

Will + S + V ...?

Can/Could + S + V ...?

Wh-word + auxiliary + S + V ...?


For example, "will" may have useful patterns such as:

S + will + V

Will + S + V?

S + will not + V

Wh-word + will + S + V?

S + will + be + N/Adj

Will + S + be + N/Adj?

S + will + be + V-ing

Will + S + be + V-ing?

S + will + have + V3

Will + S + have + V3?


These are examples only.

DO NOT copy this structure mechanically for other words.

Do not generate a question form merely because a question form
can theoretically be constructed.

Include it only if it is genuinely useful for the word.


==============================================================
NOUN PATTERNS
==============================================================

For nouns, consider structures such as:

N + preposition

N + of + N

N + to + N

N + that-clause

N + wh-clause

Adj + N

determiner + N

quantifier + N

common noun + complement structures

common fixed noun constructions


Do not force verb-style patterns onto nouns.


==============================================================
ADJECTIVE PATTERNS
==============================================================

For adjectives, consider structures such as:

be + Adj

Adj + N

Adj + to V

Adj + V-ing

Adj + preposition + N

Adj + that-clause

Adj + wh-clause

Adj + enough + to V

too + Adj + to V


Only include structures that are natural for the specific
adjective.


==============================================================
PREPOSITIONS
==============================================================

If the word normally requires or strongly prefers a particular
preposition, preserve the preposition exactly.

Examples:

depend on + N

interested in + N/V-ing

responsible for + N/V-ing

good at + N/V-ing


Do not remove required prepositions.


==============================================================
PHRASAL VERBS AND FIXED CONSTRUCTIONS
==============================================================

If the word commonly forms a phrasal verb or fixed construction,
preserve the complete structure.

Examples:

take care of + N

take advantage of + N

look forward to + N/V-ing

be afraid of + N/V-ing


Do not treat the individual words as separate patterns when
the complete construction is the meaningful grammatical unit.


==============================================================
QUESTIONS AND NEGATIVE FORMS
==============================================================

Question and negative patterns may be included when they provide
useful information about how the word is actually used.

Examples:

Will + S + V?

Do/Does + S + V?

Wh-word + do/does + S + V?

S + do/does not + V

S + will not + V


However:

DO NOT automatically create affirmative, negative, yes/no
question, and wh-question versions of every pattern.

Only include variants that add meaningful information.


==============================================================
CLAUSES
==============================================================

Consider clause patterns when the word commonly introduces or
requires them.

Examples:

V + that-clause

V + wh-clause

Adj + that-clause

N + that-clause

V + whether-clause

V + if-clause


Preserve the actual conjunction or clause marker when it is
important.


==============================================================
PATTERN DIVERSITY
==============================================================

Explore the word broadly before selecting the final patterns.

Do NOT stop after finding only the first few obvious patterns.

Prefer diversity of genuinely useful grammatical structures
over repeating nearly identical patterns.

For example, if a word naturally has:

- a noun complement pattern
- an infinitive pattern
- a gerund pattern
- a preposition pattern
- an object-complement pattern
- a question pattern

then these should generally be preferred over six minor
variations of the same structure.


==============================================================
PATTERN SELECTION
==============================================================

Return up to ${PATTERN_CONFIG.MAX_PATTERNS} genuinely useful patterns.

Try to identify all important common patterns before stopping.

Do not generate patterns merely to reach the maximum.

Do not invent rare, archaic, highly technical, or unnatural
patterns.

Prefer patterns that are useful for English learners.

Prefer common modern English usage.

Rank patterns from the most common/useful to less common/useful.

Remove duplicate or nearly duplicate patterns.

If the word has multiple important parts of speech, include
important patterns from each relevant part of speech.

The final list should be diverse when the word naturally has
diverse grammatical behavior.


==============================================================
VIETNAMESE MEANING
==============================================================

For every pattern, provide a concise Vietnamese explanation.

The meaning must explain the function or meaning of the WHOLE
pattern.

Do NOT simply translate the individual words.

Normally use approximately 3-10 Vietnamese words.

Do not include example sentences.

Examples:

make + O + V
meaning:
"bắt hoặc ép ai làm gì"

want + O + to V
meaning:
"muốn ai làm gì"

avoid + V-ing
meaning:
"tránh làm gì"

depend on + N
meaning:
"phụ thuộc vào cái gì/ai"

It takes + O + time + to V
meaning:
"mất bao lâu để ai làm gì"


==============================================================
IMPORTANT RESTRICTIONS
==============================================================

1. Do not return ordinary example sentences.

2. Do not use placeholders such as:
   something
   somebody
   someone
   a person

3. Use the notation system defined above.

4. Preserve required prepositions.

5. Preserve particles in phrasal verbs.

6. Do not translate patterns word-for-word.

7. Do not invent patterns.

8. Do not create patterns simply to reach the maximum.

9. Do not mechanically copy the structure of the examples.

10. Do not assume every word behaves like a verb.

11. Consider the actual part of speech of the word.

12. Prefer natural, common English usage.

13. Prefer patterns that help an English learner understand
    how to construct sentences with the word.

14. Avoid redundant patterns that provide almost the same
    grammatical information.


==============================================================
OUTPUT
==============================================================

Return ONLY valid JSON.

Do not use Markdown.

Do not use code fences.

Do not write explanations before or after the JSON.

The JSON must have exactly this structure:

{
  "word": "${word}",
  "part_of_speech": [],
  "patterns": [
    {
      "pattern": "",
      "meaning": ""
    }
  ]
}

The "word" field must contain the input word.

The "part_of_speech" field must be an array of strings.

The "patterns" field must be an array of objects.

Each pattern object must contain exactly:

"pattern"

and

"meaning"

Do not add any other properties.
`;


  // ========================================================
  // Groq Payload
  // ========================================================

  const payload = {

    model: PATTERN_CONFIG.MODEL,

    messages: [
      {
        role: "user",
        content: prompt
      }
    ],

    temperature: 0.2,

    max_completion_tokens: 3000,

    reasoning_effort: "low",

    reasoning_format: "hidden",

    response_format: {
      type: "json_object"
    }

  };


  // ========================================================
  // API Request
  // ========================================================

  const response = UrlFetchApp.fetch(
    url,
    {
      method: "post",

      contentType: "application/json",

      headers: {
        "Authorization": "Bearer " + apiKey
      },

      payload: JSON.stringify(payload),

      muteHttpExceptions: true
    }
  );


  // ========================================================
  // HTTP Response
  // ========================================================

  const statusCode =
    response.getResponseCode();

  const responseText =
    response.getContentText();


  if (statusCode < 200 || statusCode >= 300) {

    throw new Error(
      "Groq API error " +
      statusCode +
      ": " +
      responseText
    );

  }


  // ========================================================
  // Parse API response
  // ========================================================

  let data;

  try {

    data =
      JSON.parse(responseText);

  } catch (error) {

    throw new Error(
      "Không thể parse Groq API response: " +
      responseText
    );

  }


  // ========================================================
  // Validate choices
  // ========================================================

  if (
    !data.choices ||
    !data.choices.length ||
    !data.choices[0].message
  ) {

    throw new Error(
      "Groq không trả về dữ liệu hợp lệ: " +
      responseText
    );

  }


  // ========================================================
  // Get generated content
  // ========================================================

  const text =
    data.choices[0]
      .message
      .content;


  if (!text) {

    throw new Error(
      "Groq trả về content rỗng."
    );

  }


  // ========================================================
  // Parse generated JSON
  // ========================================================

  let result;

  try {

    result =
      JSON.parse(text);

  } catch (error) {

    throw new Error(
      "Groq trả về JSON không hợp lệ: " +
      text
    );

  }


  // ========================================================
  // Validate root object
  // ========================================================

  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result)
  ) {

    throw new Error(
      "Groq response không phải JSON object."
    );

  }


  // ========================================================
  // Validate word
  // ========================================================

  if (
    typeof result.word !== "string"
  ) {

    throw new Error(
      "Groq response thiếu trường 'word'."
    );

  }


  // ========================================================
  // Validate part_of_speech
  // ========================================================

  if (
    !Array.isArray(result.part_of_speech)
  ) {

    throw new Error(
      "Groq response thiếu 'part_of_speech'."
    );

  }


  // ========================================================
  // Validate patterns
  // ========================================================

  if (
    !Array.isArray(result.patterns)
  ) {

    throw new Error(
      "Groq response thiếu 'patterns'."
    );

  }


  // ========================================================
  // Validate each pattern
  // ========================================================

  result.patterns.forEach(
    function(item, index) {

      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
      ) {

        throw new Error(
          "Pattern #" +
          (index + 1) +
          " không hợp lệ."
        );

      }


      if (
        typeof item.pattern !== "string"
      ) {

        throw new Error(
          "Pattern #" +
          (index + 1) +
          " thiếu 'pattern'."
        );

      }


      if (
        typeof item.meaning !== "string"
      ) {

        throw new Error(
          "Pattern #" +
          (index + 1) +
          " thiếu 'meaning'."
        );

      }

    }
  );


  // ========================================================
  // Remove empty patterns
  // ========================================================

  result.patterns =
    result.patterns.filter(
      function(item) {

        return (
          item.pattern.trim() !== "" &&
          item.meaning.trim() !== ""
        );

      }
    );


  // ========================================================
  // Remove duplicate patterns
  // ========================================================

  const seenPatterns = {};

  result.patterns =
    result.patterns.filter(
      function(item) {

        const key =
          item.pattern
            .trim()
            .toLowerCase();

        if (seenPatterns[key]) {
          return false;
        }

        seenPatterns[key] = true;

        return true;

      }
    );


  // ========================================================
  // Limit maximum patterns
  // ========================================================

  if (
    result.patterns.length >
    PATTERN_CONFIG.MAX_PATTERNS
  ) {

    result.patterns =
      result.patterns.slice(
        0,
        PATTERN_CONFIG.MAX_PATTERNS
      );

  }


  // ========================================================
  // Normalize word
  // ========================================================

  result.word =
    result.word.trim();


  // ========================================================
  // Return
  // ========================================================

  return result;
}