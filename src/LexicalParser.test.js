const LexicalParser = require('./LexicalParser')

const parser = new LexicalParser

const str = `   
<p class="header">
  Several <em>emphasized words</em> appear <strong>in this</strong> sentence, dear.
  <img src="xx.png" crossOrigin />
</p>
`

let process = ''
for(let i = 0, l = str.length; i < l; i++) {
  const char = str[i]
  try {
    parser.receiveInput(char)
    process += char
  } catch(e) {
    console.error('interrupt at\n', process)
    break;
  }
}

console.log(parser.tokens)