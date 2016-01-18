'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _configLoader = require('./config-loader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _codeweight = require('./codeweight');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(configPath) {
    var config;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = (0, _configLoader2.default)(configPath);

            if (!(config == null)) {
              _context.next = 3;
              break;
            }

            throw new Error('Could not find codeweight config');

          case 3:
            _context.next = 5;
            return (0, _codeweight.processFiles)(config);

          case 5:
            _context.t0 = _context.sent;
            _context.t1 = config.rev;
            (0, _codeweight.printToConsole)(_context.t0, _context.t1);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function (_x) {
    return ref.apply(this, arguments);
  };
}();