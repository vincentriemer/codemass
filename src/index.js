import configLoader from './config-loader';
import checkSize from './codeweight';

module.exports = function(configPath) {
  const config = configLoader(configPath);

  if (config == null) {
    throw new Error('Could not find checksize config');
  }

  checkSize(config);
};