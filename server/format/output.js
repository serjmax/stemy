const LINE_BREAK = require('./regexp');
const WORD = require('./regexp');
const TAG = 'span';

module.exports = (allGrammemes, string) => {
  allGrammemes.forEach(word => {
    string = string.replace(WORD(word.text), ` <${TAG} class="${word.gr}">$2</${TAG}>`);
  });

  return string.replace(LINE_BREAK, '<br>');
};
