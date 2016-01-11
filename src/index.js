import configLoader from './config-loader';
import checkSize from './codeweight';

export default function(configPath) {
  const config = configLoader(configPath);

  if (config == null) {
    throw new Error('Could not find checksize config');
  }

  checkSize(config);
}