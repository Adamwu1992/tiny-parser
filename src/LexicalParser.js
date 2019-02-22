/**
 * 这个模块的主要职责是词法分析。
 * 
 * 当开始读取一个字符串时，首先我们需要判断第一个吃进的字符是什么：
 * - 如果不是`<`，表示是一个文本节点；
 * - 如果是`<`，需要进而判断紧跟着的字符：
 *   - 如果是`/`，表示这是一个标签关闭；
 *   - 如果是`!`，表示这是一个注释；
 *   - 我们还有可能读到其他的字符，比如`?`或者`[`，在这里我们不处理这样的情况，直接抛错就可以了。
 * 
 * ```html
 * <p class="header">
 *   Several <em>emphasized words</em> appear <strong>in this</strong> sentence, dear.
 *   <img src="xx.png" crossOrigin />
 * </p>
 * ```
 * 
 * 如果输入的字符串如上，我们期望得到的tokens应该是：
 * ```
 * 0: TagOpen { name: 'p' }
 * 1: Attribute { name: 'class', value: 'header' }
 * 2: 'Several '
 * 3: TagOpen: { name: 'em' }
 * 4: 'emphasized words'
 * 5: TagClose: { name: 'em' }
 * 6: ' appear '
 * 7: TagOpen: { name: 'strong' }
 * 8: ' in this '
 * 9: TagClose: { name: 'strong' }
 * 10: ' sentence, dear.'
 * 11: TagOpen: { name: 'img' }
 * 12: Attribute: { name: 'src', value: 'xx.png' }
 * 13: Attribute: { name: 'crossOrigin' }
 * 14: TagSelfClose: { }
 * 15: TagClose: { name: 'p' }
 * ```
 * 
 */


const {
  isLetter,
  isWhiteSpace,
  unexpectedChar,
  TagOpen,
  TagClose,
  TagSelfClose,
  Attr
} = require('./utils')



function LexicalParser(syntacticParser) {

  const globalTokens = []
  let state = data
  let token = null
  let text = ''
  this.tokens = globalTokens
  this.receiveInput = function(char) {
    // console.log('[receive char]', char)
    state = state(char)
  }

  function collectToken({ type } = { type: 'token' }) {
    if (type === 'token') {

      if (syntacticParser) {
        syntacticParser.receiveToken(token)
      }

      if (token) {
        globalTokens.push(token)
      }
      
      token = null
    } else {

      if (syntacticParser) {
        syntacticParser.receiveToken(text)
      }

      if (text) {
        globalTokens.push(text)
      }

      text = ''
    }
  }

  function data(char) {
    if (char === '<') return startTagOpen
    if (isWhiteSpace(char)) {
      collectToken()
      return data
    }
    text += char
    return startText
  }

  function startText(char) {
    if (char === '<') {
      collectToken({ type: 'text' })
      return startTagOpen
    }
    text += char
    return startText
  }

  // when get `<`
  function startTagOpen(char) {
    if (isLetter(char)) {
      token = new TagOpen()
      token.name = char.toLowerCase()
      return tagName
    }
    if (char === '/') {
      return StartTagClose
    }
    return unexpectedChar()
  }

  // when get `</`
  function StartTagClose(char) {
    if (isLetter(char)) {
      token = new TagClose()
      token.name = char.toLowerCase()
      return tagName
    }
    return unexpectedChar()
  }

  function tagName(char) {
    if (isLetter(char)) {
      token.name += char.toLowerCase()
      return tagName
    }
    // next is attr
    if (isWhiteSpace(char)) {
      collectToken()
      return beforeAttrName
    }
    // tagOpen or tagClose is completed
    if (char === '>') {
      collectToken()
      return data
    }
    return unexpectedChar()
  }

  function beforeAttrName(char) {
    if (isLetter(char)) {
      token = new Attr()
      token.name = char.toLowerCase()
      return attrName
    }
    if (char === '>') {
      collectToken()
      return data
    }
    if (char === '/') {
      collectToken()
      token = new TagSelfClose()
      return beforeTagSelfClosing
    }
  }

  function beforeTagSelfClosing(char) {
    if (char === '>') {
      collectToken()
      return data
    }
    return unexpectedChar()
  }

  function attrName(char) {
    if (isLetter(char)) {
      token.name += char.toLowerCase()
      return attrName
    }
    if (char === '=') {
      return beforeAttrValue
    }
    if (isWhiteSpace(char)) {
      collectToken()
      return afterAttrValue
    }
    if (char === '/') {
      collectToken()
      token = new TagSelfClose()
      return beforeTagSelfClosing
    }
    return unexpectedChar()
  }

  function beforeAttrValue(char) {
    if (char === '"') {
      return beforeAttrValue
    }
    // attribute's value can be any character
    token.value = char.toLowerCase()
    return attrValue
  }

  function attrValue(char) {
    if (char === '"') {
      collectToken()
      return afterAttrValue
    }
    // attribute's value can be any character
    token.value += char.toLowerCase()
    return attrValue
  }

  function afterAttrValue(char) {
    if (isWhiteSpace(char)) {
      return beforeAttrName
    }
    if (char === '/') {
      collectToken()
      token = new TagSelfClose()
      return beforeTagSelfClosing
    }
    if (char === '>') {
      collectToken()
      return data
    }
    return unexpectedChar()
  }
}

module.exports = LexicalParser