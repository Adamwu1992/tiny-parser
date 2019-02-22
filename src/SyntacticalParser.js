
/**
 * 这个模块的主要职责是语法分析。
 * 
 * 最终结果是需要构建出一棵DOM树，其中有三类节点：
 * - HTML Document，根节点
 * - Element，元素节点
 * - Text，文本节点
 * 
 * 接受上一步产生的token，用一个栈来储存，之后所有的操作都是针对栈顶节点的操作：
 * - 栈的第一个元素是HTML Document节点
 * - 如果遇到TagOpen类型token，创建一个Element，添加到栈顶节点的children，并且将该Element入栈
 * - 如果遇到的是string类型的token，判断当前栈顶节点类型，如果是Text则追加，否则添加进children
 * - 如果遇到的是Attr类型token，那么当前栈顶节点必须是Element，（此处可做检查），添加进栈顶节点的props
 * - 如果遇到的是TagClose类型的节点，那么将站定节点出栈（如果TagClose存在name，则必须和栈顶节点name一致，此处可以检查）
 */

const {
  TagOpen,
  TagClose,
  TagSelfClose,
  Attr
} = require('./utils')


class Node {}

class HTMLDocument extends Node {
  constructor() {
    super()
    this.children = []
    this.name = 'document'
  }
}

class Element extends Node {
  constructor(name) {
    super()
    this.children = []
    this.props = []
    this.name = name
  }
}

class Text extends Node {
  constructor(value) {
    super()
    this.value = value
  }
}


function SyntacticParser() {
  
  const stack = [new HTMLDocument]

  const top = () => stack[stack.length - 1]

  this.receiveToken = function(token) {
    console.log('[receive token]', token)
    if (token instanceof TagOpen) {
      handleTagOpen(token)
    } else if (token instanceof TagClose) {
      handleTagClose(token)
    } else if (token instanceof TagSelfClose) {
      handleTagSelfClose()
    } else if (token instanceof Attr) {
      handleAttr(token)
    } else if (typeof token === 'string') {
      handleText(token)
    }
  }

  this.output = stack[0]

  function handleText(token) {
    if (top() instanceof Text) {
      top().value += token
    } else {
      top().children.push(new Text(token))
    }
  }

  function handleTagOpen(token) {
    const node = new Element(token.name)
    if (top() instanceof Text) {
      stack.pop()
    }
    top().children.push(node)
    stack.push(node)
  }

  function handleAttr(token) {
    const attr = {
      name: token.name,
      value: token.value === undefined ? true : token.value
    }
    top().props.push(attr)
  }

  function handleTagClose(token) {
    if (token.name === top().name) {
      stack.pop()
    } else {
      console.error('tag close is not matched.')
    }
  }

  function handleTagSelfClose() {
    stack.pop()
  }
}

module.exports = SyntacticParser