'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.default = load;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _stripJsonComments = require('strip-json-comments');

var stripJSONComments = _interopRequireWildcard(_stripJsonComments);

var _glob = require('glob');

var glob = _interopRequireWildcard(_glob);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configuration sources in priority order.
// inspired by https://github.com/commitizen/cz-cli/blob/master/src/configLoader/loader.js

/**
 * The MIT License (MIT)
 *
 * Copyright 2013 Dulin Marat and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Command line config helpers
 */
var configs = ['package.json', '.codeweight', '.codeweight.json'];

// Before, "findup-sync" package was used,
// but it does not provide filter callback
function findup(patterns, options, fn) {
  /* jshint -W083 */

  var lastpath;
  var file;

  options = (0, _create2.default)(options);
  options.maxDepth = 1;
  options.cwd = path.resolve(options.cwd);

  do {
    file = patterns.filter(function (pattern) {
      var configPath = glob.sync(pattern, options)[0];

      if (configPath) {
        return fn(path.join(options.cwd, configPath));
      }
    })[0];

    if (file) {
      return path.join(options.cwd, file);
    }

    lastpath = options.cwd;
    options.cwd = path.resolve(options.cwd, '..');
  } while (options.cwd !== lastpath);
}

function getNormalizedConfig(config, content) {

  if (content && config == 'package.json') {
    // PACKAGE.JSON

    // use npm config key
    if (content.config && content.config.codeweight) {
      return content.config.codeweight;
    }
  } else {
    // .checksize or .checksize.json
    return content;
  }
}

/**
 * Get content of the configuration file.
 *
 * @param {String} config - partial path to configuration file
 * @param {String} directory - directory path which will be joined with config argument
 * @return {Object}
 */
function getContent(config, directory) {
  if (!config) {
    return;
  }

  var configPath = path.resolve(directory, config);
  var ext;
  var content;

  config = path.basename(config);

  if (fs.existsSync(configPath)) {
    ext = path.extname(configPath);

    if (ext === '.js' || ext === '.json') {
      content = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
      content = JSON.parse(stripJSONComments(fs.readFileSync(configPath, 'utf8')));
    }

    // Adding property via Object.defineProperty makes it
    // non-enumerable and avoids warning for unsupported rules
    Object.defineProperty(content, 'configPath', {
      value: configPath
    });
  }
  return getNormalizedConfig(config, content);
}

/**
 * Get content of the configuration file.
 *
 * @param {String} config - partial path to configuration file
 * @return {Object|undefined}
 */
function load(config) {
  var content;
  var directory = process.cwd();

  // If config option is given, attempt to load it
  if (config) {
    return getContent(config, directory);
  }

  content = getContent(findup(configs, { nocase: true, cwd: directory }, function (configPath) {
    if (path.basename(configPath) === 'package.json') {
      // return !!getContent(configPath);
    }

    return true;
  }));

  if (content) {
    return content;
  }

  // Try to load standard configs from home dir
  var directoryArr = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME];
  for (var i = 0, dirLen = directoryArr.length; i < dirLen; i++) {
    if (!directoryArr[i]) {
      continue;
    }

    for (var j = 0, len = configs.length; j < len; j++) {
      content = getContent(configs[j], directoryArr[i]);

      if (content) {
        return content;
      }
    }
  }
}