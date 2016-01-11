#!/usr/bin/env node
import cli from 'commander';
import { red, yellow } from 'colors/safe';

import configLoader from './config-loader';
import { processFiles, printToConsole } from './codeweight';

const pjson = require('../package.json');
const version = pjson.version || 'development';

cli
  .version(version)
  .option('-c, --config', 'set config path. defaults to seaching in package.json, .checksize, .checksize.json.')
  .parse(process.argv);

const {
  config: configPath
} = cli;

const config = configLoader(configPath);

if (config == null) {
  console.error(red('ERROR: Could not find checksize config. See below for usage.'));
  cli.outputHelp(yellow);
  process.exit(1);
}

printToConsole(processFiles(config));