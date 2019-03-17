#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const request = require('request');
const unzip = require('inly');

const TARBALL_URLS = {
  linux: {
    ia32: 'https://download.cdn.yandex.net/mystem/mystem-3.0-linux3.5-32bit.tar.gz',
    x64: 'https://download.cdn.yandex.net/mystem/mystem-3.1-linux-64bit.tar.gz',
  },
  darwin: {
    x64: 'https://download.cdn.yandex.net/mystem/mystem-3.1-macosx.tar.gz',
  },
  win32: {
    ia32: 'https://download.cdn.yandex.net/mystem/mystem-3.0-win7-32bit.zip',
    x64: 'https://download.cdn.yandex.net/mystem/mystem-3.1-win-64bit.zip',
  },
  freebsd: {
    x64: 'https://download.cdn.yandex.net/mystem/mystem-3.0-freebsd9.0-64bit.tar.gz',
  },
};

const PLATFORM_TYPE_ARCHIVE = {
  linux: '.tar.gz',
  darwin: '.tar.gz',
  win32: '.zip',
  freebsd: '.tar.gz',
};

function downloadFile(url, dest, cb) {
  console.log('Downloading %s', url);
  const file = fs.createWriteStream(dest);

  const req = request.get(url);
  req.pipe(file).on('error', err => {
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });

  file.on('finish', () => {
    file.close(cb); // close() is async, call cb after close completes.
  });
}

function unzipFile(src, dest, cb) {
  console.log('Extracting %s', src);

  unzip(src, dest)
    .on('error', error => cb(error))
    .on('end', () => cb());
}

function main() {
  const targetDir = path.join(__dirname, '..', 'vendor', process.platform);
  const tmpFile = path.join(targetDir, `mystem${PLATFORM_TYPE_ARCHIVE[process.platform]}`);
  const url = TARBALL_URLS[process.platform][process.arch];

  mkdirp(targetDir, err1 => {
    if (err1) throw err1;

    downloadFile(url, tmpFile, err2 => {
      if (err2) throw err2;

      unzipFile(tmpFile, targetDir, err3 => {
        if (err3) throw err3;
        console.log('Unlink', tmpFile);
        fs.unlink(tmpFile);
      });
    });
  });
}

main();
