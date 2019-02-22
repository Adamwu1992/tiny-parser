const parser = require('./index')

const str = `   
<p class="header">
  Several <em>emphasized words</em> appear <strong>in this</strong> sentence, dear.
  <img src="xx.png" crossOrigin />
</p>
`

const ast = parser(str)

console.log(ast)
console.log(JSON.stringify(ast))