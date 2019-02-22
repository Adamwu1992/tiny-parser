/**
 * 这里我们将实现一个HTML的parser，具体来讲就是将文本格式的html代码转化为dom树。
 * 
 * 这并非是一个全功能的parser，所以最后生成的dom树的Node类型只有Element和Text两种。
 * 
 * ```html
 * <p class="header">
 *   Several <em>emphasized words</em> appear <strong>in this</strong> sentence, dear.
 * </p>
 * ```
 * 
 * 比如上面这段html代码，进过我们parser转化后的dom树将是下面的样子
 * 
 * ```js
 * {
 *   type: 'Element',
 *   content: 'p',
 *   props: [
 *      {
 *        name: 'class',
 *        value: 'header'
 *      }
 *   ],
 *   children: [
 *     {
 *       type: 'Text',
 *       name: 'Several '
 *     },
 *     {
 *       type: 'Element',
 *       name: 'em',
 *       children: [
 *         {
 *           type: 'Text',
 *           name: 'emphasized words'
 *         }
 *       ]
 *     },
 *     {
 *       type: 'Text',
 *       name: ' appear '
 *     },
 *     {
 *       type: 'Element',
 *       name: 'strong',
 *       children: [
 *         {
 *           type: 'Text',
 *           name: 'in this'
 *         }
 *       ]
 *     },
 *     {
 *       type: 'Text',
 *       name: ' sentence, dear.'
 *     }
 *   ]
 * }
 * ```
 * 
 * 从OOP的角度分析，构建dom树需要两个Class：Element和Text。
 * Text比较简单，只有一个属性值name用来记录文本节点的内容。
 * Element有三个属性值：name、props和children：
 * - name用来标识元素节点的类型
 * - props是一个数组，记录节点上的属性
 * - children则记录了所有的子节点信息
 * 
 * 
 * 转换的过程会被分成两个阶段，词法分析和语法分析
 * 
 * 词法分析阶段，文本将会被转化成tokens；
 * 语法分析阶段，将tokens构建成有结构的dom树。
 */

const LexicalParser = require('./LexicalParser')
const SyntacticParser = require('./SyntacticalParser')

function parser(input) {
  const syntacticParser = new SyntacticParser
  const lexicalParser = new LexicalParser(syntacticParser)

  let process = ''
  for(let i = 0, l = input.length; i < l; i++) {
    const char = input[i]
    try {
      lexicalParser.receiveInput(char)
      process += char
    } catch(e) {
      console.error('interrupt at\n', process)
      break;
    }
  }

  return syntacticParser.output
}


module.exports = parser
