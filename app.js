var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MyStem = require('./lib/MyStem');
var Promise = require('bluebird');


app.use(bodyParser.text());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/', function (req, res) {
    // console.log(req.body);
    // console.log(req.query);
    
    var myStem = new MyStem();

    myStem.start();

    // var words = ['карусели', 'немцы', 'печалька'];
    const words = req.body.split(' ');

    var promises = words.map(function(word) {
        return myStem.extractAllGrammemes(word)
    });

    Promise.all(promises).then(function(lemmas) {
        console.log(lemmas);
        myStem.stop();
    });
    
    res.send('OK');
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});