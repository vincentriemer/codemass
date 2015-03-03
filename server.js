// New Relic App Monitoring
if (process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME) {
  console.log("NewRelic key detected, activating NewRelic support...");
  require('newrelic');
}

// Imports
var koa = require('koa'),
  router = require('koa-router')(),
  rp = require('request-promise'),
  logger = require('koa-logger'),
  cache = require('koa-cash');

// App initializations
var app = koa();

var redis;
if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  redis = require("then-redis").createClient({
    port: rtg.port,
    host: rtg.hostname,
    password: rtg.auth.split(":")[1]
  });
} else {
  console.log('No Redistogo detected, configuring with local redis server...');
  redis = require('then-redis').createClient();
}

redis.flushall();

// Constants
var GITHUB_API_BASE_URL = 'https://api.github.com';
var CACHE_EXPIRATION_TIME = parseInt(process.env.CACHE_EXP) || 600;
var GITHUB_CLIENT = process.env.CODEWEIGHT_GITHUB_CLIENT;
var GITHUB_SECRET = process.env.CODEWEIGHT_GITHUB_SECRET;

// Helper functions
var bytesToSize = function(bytes) {  // found on some stackoverflow answer
  if(bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

var getBadge = function *(username, repo, path) {
  var target = `${GITHUB_API_BASE_URL}/repos/${username}/${repo}/contents/${path}?client_id=${GITHUB_CLIENT}&client_secret=${GITHUB_SECRET}`;

  var githubResult = yield rp({url: target, headers: {'User-Agent': 'codemass'}}).
    then(function (response) {return response;});

  var size = bytesToSize(parseInt(JSON.parse(githubResult).size));

  var shieldTarget = `https://img.shields.io/badge/size-${size}-blue.svg?style=flat`;

  return yield rp(shieldTarget).then(function (response) {return response;});
};

var cacheGet = function*(key) {
  return JSON.parse(yield redis.get(key));
};

var cacheSet = function* (key, value) {
  redis.setex(key, CACHE_EXPIRATION_TIME, JSON.stringify(value));
};


// Routing
router.get(/^\/([\w\-]*){1}\/([\w\-]*){1}\/blob\/([\w\-]*){1}\/(.*){1}$/i, function *(next) {

  if (yield* this.cashed()) return;

  var username = this.captures[0],
    repo = this.captures[1],
    branch = this.captures[2],
    path = this.captures[3];

  var shieldResult = yield getBadge(username, repo, path);

  this.set('Cache-Control', 'no-cache, no-store');
  this.response.type = 'image/svg+xml';
  this.response.body = shieldResult;
});

// Middleware
app.use(logger());
app.use(cache({
  get: cacheGet,
  set: cacheSet
}));
app.use(router.routes());

// Starting the server
var port = process.env.PORT || 3000;
console.log(`Listening on port ${port}`);
app.listen(port);