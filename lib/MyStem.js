const childProcess = require('child_process');
const readline = require('readline');
const path = require('path');

module.exports = class {
  constructor(...args) {
    const params = args || {};

    this.path = params.path || path.join(__dirname, '..', 'vendor', process.platform, 'mystem');
    this.handlers = [];
  }

  start(...params) {
    if (this.mystemProcess) return;

    this.mystemProcess = childProcess.spawn(this.path, params);
    const rd = readline.createInterface({ input: this.mystemProcess.stdout, terminal: false });

    rd.on('line', line => {
      const handler = this.handlers.shift();

      if (handler) {
        const data = JSON.parse(line);
        handler.resolve(this.getGrammemes(data, handler.onlyLemma) || handler.word);
      }
    });

    this.mystemProcess.on('error', err => {
      const handler = this.handlers.shift();

      if (handler) {
        handler.reject(err);
      }
    });

    process.on('exit', () => {
      if (this.mystemProcess) {
        this.mystemProcess.kill();
      }
    });
  }

  stop() {
    if (this.mystemProcess) {
      this.mystemProcess.kill();
    }
  }

  extractAllGrammemes(text) {
    return this.callMyStem(text);
  }

  lemmatize(text) {
    const onlyLemma = true;
    return this.callMyStem(text, onlyLemma);
  }

  callMyStem(text, onlyLemma) {
    return new Promise((resolve, reject) => {
      if (!this.mystemProcess) {
        throw Error('You should call MyStem.start()');
      }

      this.mystemProcess.stdin.write(text + '\r\n');

      this.handlers.push({
        resolve,
        reject,
        text,
        onlyLemma,
      });
    });
  }

  getGrammemes(data, onlyLemma) {
    const result = [];

    data.forEach(word => {
      if (word.analysis.length) {
        const gr = word.analysis[0].gr.split(',')[0].split('=')[0];
        result.push({ gr, text: word.text });
      }
    });

    return result;

    // if (data[0].analysis.length) {
    //   if (onlyLemma) {
    //     return data[0].analysis[0].lex;
    //   }

    //   const array = [];
    //   array.push(data[0].analysis[0].lex);

    //   data[0].analysis[0].gr.split(',').map(elem => {
    //     array.push(elem);
    //   });

    //   return array;
    // }

    // return data[0].text;
  }
};
