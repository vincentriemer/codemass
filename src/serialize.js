import filesize from 'filesize';
import { grey, green, red, cyan } from 'colors/safe';

function fileSizeWrapper(bytes) {
  return filesize(bytes, { base: 10 });
}

function sizePercent(fsBytes, revBytes) {
  // const percent = Math.floor(10000 * (1 - (revBytes / fsBytes))) / 100;
  const percent = -1 * ((revBytes - fsBytes) / revBytes) * 100;
  const prefix = percent > 0 ? '+' : '';
  return grey(`${prefix}${percent}%`);
}

function sizeDiff(fsBytes, revBytes) {
  const diff = fsBytes - revBytes;
  if (diff === 0) {
    return `${fileSizeWrapper(diff)}`;
  } else if (diff < 0) {
    return `${green(fileSizeWrapper(diff))}`;
  } else {
    return `${red('+' + fileSizeWrapper(diff))}`
  }
}

function sizeRaw(fsBytes) {
  return cyan(fileSizeWrapper(fsBytes));
}

export default function serialize({name, fsBytes, revBytes}) {
  return [
    name,
    sizeRaw(fsBytes),
    sizePercent(fsBytes, revBytes),
    sizeDiff(fsBytes, revBytes)
  ];
}