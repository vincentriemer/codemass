#!/usr/bin/env node
import cli from 'commander';
import { red, yellow } from 'colors/safe';

import configLoader from './config-loader';
import { processFiles, printToConsole } from './codeweight';

const pjson = require('../package.json');
const version = pjson.version || 'development';

cli
  .version(version)
  .option('-c, --config', 'set config path. defaults to seaching in package.json, .codeweight, .codeweight.json.')
  .parse(process.argv);

const {
  config: configPath
} = cli;

const config = configLoader(configPath);

if (config == null) {
  console.error(red('ERROR: Could not find codeweight config. See below for usage.'));
  cli.outputHelp(yellow);
  process.exit(1);
}

(async () => {
  printToConsole(await processFiles(config), config.rev);
})();

