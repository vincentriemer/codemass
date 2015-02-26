'use strict';
require('newrelic');

var koa = require('koa');
var router = require('koa-router')();
var rp = require('request-promise');
var logger = require('koa-logger');

var app = koa();

function bytesToSize(bytes) {  // found on some stackoverflow answer
  if(bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

var githubAPI = 'https://api.github.com';

router.get(/^\/([\w\-]*){1}\/([\w\-]*){1}\/blob\/([\w\-]*){1}\/(.*){1}$/i, function *(next) {

  var username = this.captures[0],
    repo = this.captures[1],
    branch = this.captures[2],
    path = this.captures[3];

  var target = `${githubAPI}/repos/${username}/${repo}/contents/${path}`;

  console.info(`      <-- SIZE ${target}`);

  var githubResult = yield rp({url: target, headers: {'User-Agent': 'codemass'}}).
    then(function(response) { return response; });

  var size = bytesToSize(parseInt(JSON.parse(githubResult).size));

  var shieldTarget = `https://img.shields.io/badge/size-${size}-blue.svg?style=flat`;

  console.info(`      <-- SVG ${shieldTarget}`);

  var shieldResult = yield rp(shieldTarget).
    then(function(response) { return response; });

  this.type = 'image/svg+xml';
  this.body = shieldResult;

  yield next;
});

app.use(logger());
app.use(router.routes());

var port = process.env.PORT || 3000;

console.log(`Listening on port ${port}`);
app.listen(port);