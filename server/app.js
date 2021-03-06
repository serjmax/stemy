const express = require('express');
const bodyParser = require('body-parser');
const MyStem = require('../lib/MyStem');
const path = require('path');

const app = express();

// middleware
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname , '../client')));

// localhost:3000/main.css
// localhost:3000/index.html = localhost:3000

// routes
app.get('/', (req, res) => {
  res.sendfile( path.join(__dirname, '../client/index.html'));
});

app.post('/', (req, res) => {
  const TAG = 'span';
  const sourceText = req.body;

  const filterText = sourceText
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\r?\n/g, ' ')
    .split(' ')
    .filter((word, i, arr) => i === arr.lastIndexOf(word))
    .join(' ');

  const myStem = new MyStem();

  myStem.start('--format', 'json', '--eng-gr', '-ig');
  myStem.extractAllGrammemes(filterText).then(allGrammemes => {
    let resultText = sourceText;
    allGrammemes.forEach((word, i) => {
      const reg = '(^|\\s)' + word.text + '(?=\\s|$|!|,)';
      resultText = resultText.replace(
        new RegExp(reg, 'gi'),
        ` <${TAG} class="${word.gr}">${word.text}</${TAG}>`
      );
    });

    resultText = resultText.replace(/\r/g, '<br>');

    myStem.stop();

    res.set('Content-Type', 'text/html');
    res.send(resultText);
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
