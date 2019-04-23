const { PUNCTUATION_MARKS, LINE_BREAK } = require('./regexp');

module.exports = string =>
  string
    .replace(PUNCTUATION_MARKS, '')
    .replace(LINE_BREAK, ' ')
    .split(' ')
    .filter((word, i, arr) => i === arr.lastIndexOf(word))
    .join(' ');
