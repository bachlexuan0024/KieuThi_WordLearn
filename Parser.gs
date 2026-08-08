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

      entries: []

    };

    result.word = parseWord(html);

    // result.ukIPA = parseIPA(html, "uk");

    result.usIPA = parseIPA(html, "us");

    result.pos = parsePOS(html);

    result.level = parseLevel(html);

    result.entries = parseEntries(html);

    return result;

  }

  // -----------------------------------------------------

  function parseWord(html){

      return Utils.htmlToText(

          extractSingle(

              html,

              'class="hw dhw"',

              "</span>"

          )

      );

  }

  // -----------------------------------------------------

  function parseIPA(html,type){

      let start;

      if(type==="us"){

          start='us dpron-i';

      }

      // else{

      //     start='uk dpron-i';

      // }

      const block=

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

  function parsePOS(html){

      const start = html.indexOf(

          'class="pos dpos'

      );

      if(start < 0)

          return "";

      const block = html.substring(start);

      return Utils.htmlToText(

          extractSingle(

              block,

              '>',

              "</span>"

          )

      );

  }

  // -----------------------------------------------------

  function parseLevel(html){

      const start = html.indexOf(

          'class="epp-xref dxref'

      );

      if(start < 0)

          return "";

      const block = html.substring(start);

      return Utils.htmlToText(

          extractSingle(

              block,

              '>',

              "</span>"

          )

      );

  }

  // -----------------------------------------------------

  function parseEntries(html){

      const entries=[];

      const blocks=

          splitByClass(

              html,

              "def-block"

          );

      blocks.forEach(

          block=>{

              const obj={

                  definition:

                      parseDefinition(block),

                  example:

                      parseExample(block)

              };

              if(obj.definition){

                  entries.push(obj);
              }

          }

      );

      return entries;

  }

  // -----------------------------------------------------

  function parseDefinition(block){

    const definition =
      Utils.htmlToText(

        extractSingle(

          block,

          'class="def ddef_d db">',

          "</div>"

        )

      );

    return definition.replace(/:\s*$/, "");

  }

  // -----------------------------------------------------

  function parseExample(block){

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

  function extractSingle(html,start,end){

      const i=

          html.indexOf(start);

      if(i<0)

          return "";

      const j=

          html.indexOf(

              end,

              i

          );

      if(j<0)

          return "";

      return html.substring(

          i+start.length,

          j

      );

  }

  // -----------------------------------------------------

  function extractAll(html,start,end){

      const arr=[];

      let pos=0;

      while(true){

          const i=

              html.indexOf(

                  start,

                  pos

              );

          if(i<0)

              break;

          const j=

              html.indexOf(

                  end,

                  i+start.length

              );

          if(j<0)

              break;

          arr.push(

              html.substring(

                  i+start.length,

                  j

              )

          );

          pos=j+end.length;

      }

      return arr;

  }

  // -----------------------------------------------------

  function extractSection(html,start,end){

      const i=

          html.indexOf(start);

      if(i<0)

          return "";

      const j=

          html.indexOf(

              end,

              i

          );

      if(j<0)

          return "";

      return html.substring(i,j);

  }

  // -----------------------------------------------------

  function extractAttribute(html,attr){

      const i=

          html.indexOf(attr);

      if(i<0)

          return "";

      const j=

          html.indexOf(

              '"',

              i+attr.length

          );

      return html.substring(

          i+attr.length,

          j

      );

  }

  // -----------------------------------------------------

  function splitByClass(html,className){

      const arr=[];

      const token='class="'+className;

      let pos=0;

      while(true){

          const i=

              html.indexOf(

                  token,

                  pos

              );

          if(i<0)

              break;

          const j=

              html.indexOf(

                  token,

                  i+1

              );

          if(j<0){

              arr.push(

                  html.substring(i)

              );

              break;

          }

          arr.push(

              html.substring(i,j)

          );

          pos=j;

      }

      return arr;

  }

  return{

      parse

  };

})();