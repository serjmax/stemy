const TAG = 'span';
const LINE_BREAK = require('./regexp');
const WORD = require('./regexp');

module.exports = (allGrammemes, string) => {
  allGrammemes.forEach(word => {
    string = string.replace(WORD(word.text), ` <${TAG} class="${word.gr}">$2</${TAG}>`);
  });

  return string.replace(LINE_BREAK, '<br>');
};
