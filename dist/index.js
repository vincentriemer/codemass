'use strict';

var _configLoader = require('./config-loader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _codeweight = require('./codeweight');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  getSize: _codeweight.getSize,
  processFiles: _codeweight.processFiles,
  printToConsole: _codeweight.printToConsole
};