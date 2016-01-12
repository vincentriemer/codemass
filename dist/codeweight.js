'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printToConsole = exports.processFiles = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _zlib = require('zlib');

var _fs = require('fs');

var _path = require('path');

var _simpleGit = require('simple-git');

var _simpleGit2 = _interopRequireDefault(_simpleGit);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _colors = require('colors');

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

var defaultTarget = 'HEAD';

function calculateBytes(contentsArray) {
  return contentsArray.map(Buffer.byteLength);
}

function processFile(target) {
  return function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
      var path = _ref.path;
      var _ref$gzip = _ref.gzip;
      var gzip = _ref$gzip === undefined ? false : _ref$gzip;
      var _ref$name = _ref.name;
      var name = _ref$name === undefined ? path : _ref$name;

      var topLevel, fsContent, branchContent, fsGzipContent, branchGzipContent, _calculateBytes, _calculateBytes2, fsBytes, branchBytes, _calculateBytes3, _calculateBytes4;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return promisedRevParse(['--show-toplevel']);

            case 2:
              topLevel = _context.sent;
              _context.next = 5;
              return promisedReadFile((0, _path.join)(topLevel.trim(), path));

            case 5:
              fsContent = _context.sent;
              _context.next = 8;
              return promisedShow([target + ':' + path]);

            case 8:
              branchContent = _context.sent;

              if (!gzip) {
                _context.next = 23;
                break;
              }

              _context.next = 12;
              return promisedGzip(fsContent);

            case 12:
              fsGzipContent = _context.sent;
              _context.next = 15;
              return promisedGzip(branchContent);

            case 15:
              branchGzipContent = _context.sent;
              _calculateBytes = calculateBytes([fsGzipContent, branchGzipContent]);
              _calculateBytes2 = (0, _slicedToArray3.default)(_calculateBytes, 2);
              fsBytes = _calculateBytes2[0];
              branchBytes = _calculateBytes2[1];
              return _context.abrupt('return', { name: name + ' (gizpped)', fsBytes: fsBytes, branchBytes: branchBytes });

            case 23:
              _calculateBytes3 = calculateBytes([fsContent, branchContent]);
              _calculateBytes4 = (0, _slicedToArray3.default)(_calculateBytes3, 2);
              fsBytes = _calculateBytes4[0];
              branchBytes = _calculateBytes4[1];
              return _context.abrupt('return', { name: name, fsBytes: fsBytes, branchBytes: branchBytes });

            case 28:
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
}

function printResults(target) {
  return function (results) {
    var outputTable = new _cliTable2.default(tableConfig);
    outputTable.push.apply(outputTable, (0, _toConsumableArray3.default)(results));

    console.log('\nSize differences since ' + (0, _colors.yellow)(target) + '\n\n' + outputTable.toString() + '\n    ');
  };
}

var processFiles = exports.processFiles = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var files = _ref2.files;
    var _ref2$target = _ref2.target;
    var target = _ref2$target === undefined ? defaultTarget : _ref2$target;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _bluebird2.default.map(files, processFile(target));

          case 3:
            return _context2.abrupt('return', _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](0);

            // TODO: Write better errors
            console.error(_context2.t0.stack);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6]]);
  }));
  return function processFiles(_x2) {
    return ref.apply(this, arguments);
  };
}();

var printToConsole = exports.printToConsole = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(processedFiles) {
    var target = arguments.length <= 1 || arguments[1] === undefined ? defaultTarget : arguments[1];
    var serializedResult;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _bluebird2.default.map(processedFiles, _serialize2.default);

          case 3:
            serializedResult = _context3.sent;

            printResults(target)(serializedResult);
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            // TODO: Write better errors
            console.error(_context3.t0.stack);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 7]]);
  }));
  return function printToConsole(_x4) {
    return ref.apply(this, arguments);
  };
}();