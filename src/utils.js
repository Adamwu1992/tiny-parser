
const isUpperCaseLetter = x => /[A-Z]/.test(x)

const isLowerCaseLetter = x => /[a-z]/.test(x)

const isLetter = x => isUpperCaseLetter(x) || isLowerCaseLetter(x)

const isWhiteSpace = x => /[\t \f\n]/.test(x)

function needInput() {
  throw new TypeError('input can not be null')
}

function unexpectedChar(char) {
  throw new Error(`${char} is unexpected`)
}

module.exports = {
  isUpperCaseLetter,
  isLowerCaseLetter,
  isLetter,
  isWhiteSpace,
  needInput,
  unexpectedChar
}