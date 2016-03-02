'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serialize;

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _safe = require('colors/safe');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fileSizeWrapper(bytes) {
  return (0, _filesize2.default)(bytes, { base: 10 });
}

function sizePercent(fsBytes, revBytes) {
  // const percent = Math.floor(10000 * (1 - (revBytes / fsBytes))) / 100;
  var percent = -1 * ((revBytes - fsBytes) / revBytes) * 100;
  var prefix = percent > 0 ? '+' : '';
  return (0, _safe.grey)('' + prefix + percent + '%');
}

function sizeDiff(fsBytes, revBytes) {
  var diff = fsBytes - revBytes;
  if (diff === 0) {
    return '' + fileSizeWrapper(diff);
  } else if (diff < 0) {
    return '' + (0, _safe.green)(fileSizeWrapper(diff));
  } else {
    return '' + (0, _safe.red)('+' + fileSizeWrapper(diff));
  }
}

function sizeRaw(fsBytes) {
  return (0, _safe.cyan)(fileSizeWrapper(fsBytes));
}

function serialize(_ref) {
  var name = _ref.name;
  var fsBytes = _ref.fsBytes;
  var revBytes = _ref.revBytes;

  return [name, sizeRaw(fsBytes), sizePercent(fsBytes, revBytes), sizeDiff(fsBytes, revBytes)];
}