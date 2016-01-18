import configLoader from './config-loader';
import { processFiles, printToConsole } from './codeweight';

module.exports = async function(configPath) {
  const config = configLoader(configPath);

  if (config == null) {
    throw new Error('Could not find codeweight config');
  }

  printToConsole(await processFiles(config), config.rev);
};