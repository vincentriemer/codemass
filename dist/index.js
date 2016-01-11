'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configPath) {
  var config = (0, _configLoader2.default)(configPath);

  if (config == null) {
    throw new Error('Could not find checksize config');
  }

  (0, _codeweight2.default)(config);
};

var _configLoader = require('./config-loader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _codeweight = require('./codeweight');

var _codeweight2 = _interopRequireDefault(_codeweight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }