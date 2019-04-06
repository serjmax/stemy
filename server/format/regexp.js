module.exports = PUNCTUATION_MARKS = new RegExp(/[.,\/#!$%\^&\*;:{}=\-_`~()]/, 'g');
module.exports = LINE_BREAK = new RegExp(/\r/, 'g');
module.exports = START_WORD = '(^|\\s)(';
module.exports = END_WORD = ')(?=\\s|$|!|,|.|<)';
module.exports = WORD = word => new RegExp(START_WORD + word + END_WORD, 'gi');
