#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _safe = require('colors/safe');

var _configLoader = require('./config-loader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _codeweight = require('./codeweight');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pjson = require('../package.json');
var version = pjson.version || 'development';

_commander2.default.version(version).option('-c, --config', 'set config path. defaults to seaching in package.json, .codeweight, .codeweight.json.').parse(process.argv);

var configPath = _commander2.default.config;

var config = (0, _configLoader2.default)(configPath);

if (config == null) {
  console.error((0, _safe.red)('ERROR: Could not find codeweight config. See below for usage.'));
  _commander2.default.outputHelp(_safe.yellow);
  process.exit(1);
}

(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _codeweight.processFiles)(config);

        case 2:
          _context.t0 = _context.sent;
          _context.t1 = config.rev;
          (0, _codeweight.printToConsole)(_context.t0, _context.t1);

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();