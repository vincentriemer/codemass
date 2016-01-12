'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serialize;

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _colors = require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function serialize(_ref) {
  var name = _ref.name;
  var fsBytes = _ref.fsBytes;
  var branchBytes = _ref.branchBytes;

  return [name, sizeRaw(fsBytes), sizePercent(fsBytes, branchBytes), sizeDiff(fsBytes, branchBytes)];
}