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

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _colors = require('colors');

var _utilities = require('./utilities');

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
    'padding-left': 0,
    'padding-right': 5
  }
};

function fileSizeWrapper(bytes) {
  return (0, _filesize2.default)(bytes, { base: 10 });
}

function sizePercent(fsBytes, gitBytes) {
  var percent = Math.floor(10000 * (1 - gitBytes / fsBytes)) / 100;
  var prefix = percent > 0 ? '+' : '';
  return (0, _colors.grey)('' + prefix + percent + '%');
}

function sizeDiff(fsBytes, gitBytes) {
  var diff = fsBytes - gitBytes;
  if (diff === 0) {
    return '' + fileSizeWrapper(diff);
  } else if (diff < 0) {
    return '' + (0, _colors.green)(fileSizeWrapper(diff));
  } else {
    return '' + (0, _colors.red)('+' + fileSizeWrapper(diff));
  }
}

function sizeRaw(fsBytes) {
  return (0, _colors.cyan)(fileSizeWrapper(fsBytes));
}

function serializeResult(_ref) {
  var name = _ref.name;
  var fsBytes = _ref.fsBytes;
  var branchBytes = _ref.branchBytes;

  return [name, sizeRaw(fsBytes), sizePercent(fsBytes, branchBytes), sizeDiff(fsBytes, branchBytes)];
}

function calculateBytes(contentsArray) {
  return contentsArray.map(Buffer.byteLength);
}

function processFile(target) {
  return function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
      var path = _ref2.path;
      var _ref2$gzip = _ref2.gzip;
      var gzip = _ref2$gzip === undefined ? false : _ref2$gzip;
      var _ref2$name = _ref2.name;
      var name = _ref2$name === undefined ? path : _ref2$name;

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

function printResults(results) {
  var outputTable = new _cliTable2.default(tableConfig);
  outputTable.push.apply(outputTable, (0, _toConsumableArray3.default)(results));
  console.log(outputTable.toString());
}

var processFiles = exports.processFiles = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref3) {
    var files = _ref3.files;
    var _ref3$target = _ref3.target;
    var target = _ref3$target === undefined ? 'HEAD' : _ref3$target;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _bluebird2.default.map(files, processFile(target)).catch(_utilities.throwError);

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function processFiles(_x2) {
    return ref.apply(this, arguments);
  };
}();

var printToConsole = exports.printToConsole = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(processedFiles) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _bluebird2.default.map(processedFiles, serializeResult).then(printResults).catch(_utilities.throwError);

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function printToConsole(_x3) {
    return ref.apply(this, arguments);
  };
}();