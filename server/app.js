const express = require('express');
const bodyParser = require('body-parser');
const MyStem = require('../lib/MyStem');
const path = require('path');

const filterInputText = require('./format/input');
const filterOutputText = require('./format/output');

const app = express();

// middleware
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, '../client')));

// routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/index.html'));
});

app.post('/', (req, res) => {
  const sourceText = req.body;
  const myStem = new MyStem();

  myStem.start('--format', 'json', '--eng-gr', '-ig');
  myStem.extractAllGrammemes(filterInputText(sourceText)).then(allGrammemes => {
    myStem.stop();
    res.set('Content-Type', 'text/html');
    res.send(filterOutputText(allGrammemes, sourceText));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App start');
});
