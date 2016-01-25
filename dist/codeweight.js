'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printToConsole = exports.processFiles = exports.getSize = undefined;

var _zlib = require('zlib');

var _fs = require('fs');

var _path = require('path');

var _simpleGit = require('simple-git');

var _simpleGit2 = _interopRequireDefault(_simpleGit);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _safe = require('colors/safe');

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var git = (0, _simpleGit2.default)();

var promisedShow = _bluebird2.default.promisify(git.show, { context: git });
var promisedRevParse = _bluebird2.default.promisify(git.revparse, { context: git });
var promisedReadFile = _bluebird2.default.promisify(_fs.readFile);
var promisedGzip = _bluebird2.default.promisify(_zlib.gzip);

var tableConfig = {
  chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
    'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
    'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
    'right': '', 'right-mid': '', 'middle': ' ' },
  head: ['File', 'Size', 'Percent', 'Diff'],
  style: {
    head: ['magenta'],
    'padding-left': 3,
    'padding-right': 0
  }
};

var defaultRev = 'HEAD';

var getSize = exports.getSize = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(path) {
    var gzip = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var rev = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var content, topLevel;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            content = null;

            // get size from local filesystem

            if (!(rev == null)) {
              _context.next = 10;
              break;
            }

            _context.next = 4;
            return promisedRevParse(['--show-toplevel']);

          case 4:
            topLevel = _context.sent;
            _context.next = 7;
            return promisedReadFile((0, _path.join)(topLevel.trim(), path));

          case 7:
            content = _context.sent;
            _context.next = 13;
            break;

          case 10:
            _context.next = 12;
            return promisedShow([rev + ':' + path]);

          case 12:
            content = _context.sent;

          case 13:
            if (!gzip) {
              _context.next = 17;
              break;
            }

            _context.next = 16;
            return promisedGzip(content);

          case 16:
            content = _context.sent;

          case 17:
            return _context.abrupt('return', Buffer.byteLength(content));

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getSize(_x3) {
    return ref.apply(this, arguments);
  };
}();

function printResults(rev) {
  return function (results) {
    var outputTable = new _cliTable2.default(tableConfig);
    outputTable.push.apply(outputTable, (0, _toConsumableArray3.default)(results));

    console.log('\nSize differences since ' + (0, _safe.yellow)(rev) + '\n\n' + outputTable.toString() + '\n    ');
  };
}

function processFile(rev) {
  return function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref) {
      var path = _ref.path;
      var _ref$gzip = _ref.gzip;
      var gzip = _ref$gzip === undefined ? false : _ref$gzip;
      var _ref$name = _ref.name;
      var name = _ref$name === undefined ? path : _ref$name;
      var outputName;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              outputName = name;

              if (gzip) {
                outputName += ' (gzipped)';
              }

              _context2.t0 = outputName;
              _context2.next = 5;
              return getSize(path, gzip);

            case 5:
              _context2.t1 = _context2.sent;
              _context2.next = 8;
              return getSize(path, gzip, rev);

            case 8:
              _context2.t2 = _context2.sent;
              return _context2.abrupt('return', {
                name: _context2.t0,
                fsBytes: _context2.t1,
                revBytes: _context2.t2
              });

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    return function (_x4) {
      return ref.apply(this, arguments);
    };
  }();
}

var processFiles = exports.processFiles = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref2) {
    var files = _ref2.files;
    var _ref2$rev = _ref2.rev;
    var rev = _ref2$rev === undefined ? defaultRev : _ref2$rev;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _bluebird2.default.map(files, processFile(rev));

          case 3:
            return _context3.abrupt('return', _context3.sent);

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3['catch'](0);

            // TODO: Write better errors
            console.error(_context3.t0.stack);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 6]]);
  }));
  return function processFiles(_x5) {
    return ref.apply(this, arguments);
  };
}();

var printToConsole = exports.printToConsole = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(processedFiles) {
    var rev = arguments.length <= 1 || arguments[1] === undefined ? defaultRev : arguments[1];
    var serializedResult;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            try {
              serializedResult = processedFiles.map(_serialize2.default);

              printResults(rev)(serializedResult);
            } catch (err) {
              // TODO: Write better errors
              console.error(err.stack);
            }

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function printToConsole(_x7) {
    return ref.apply(this, arguments);
  };
}();