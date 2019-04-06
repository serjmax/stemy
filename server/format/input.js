const PUNCTUATION_MARKS = require('./regexp');

module.exports = string =>
  string
    .replace(PUNCTUATION_MARKS, '')
    .replace(/\r?\n/g, ' ')
    .split(' ')
    .filter((word, i, arr) => i === arr.lastIndexOf(word))
    .join(' ');
