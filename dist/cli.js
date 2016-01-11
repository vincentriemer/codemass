#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _safe = require('colors/safe');

var _configLoader = require('./config-loader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _codeweight = require('./codeweight');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pjson = require('../package.json');
var version = pjson.version || 'development';

_commander2.default.version(version).option('-c, --config', 'set config path. defaults to seaching in package.json, .checksize, .checksize.json.').parse(process.argv);

var configPath = _commander2.default.config;

var config = (0, _configLoader2.default)(configPath);

if (config == null) {
  console.error((0, _safe.red)('ERROR: Could not find checksize config. See below for usage.'));
  _commander2.default.outputHelp(_safe.yellow);
  process.exit(1);
}

(0, _codeweight.printToConsole)((0, _codeweight.processFiles)(config));