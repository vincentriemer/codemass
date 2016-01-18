import filesize from 'filesize';
import { grey, green, red, cyan, yellow } from 'colors/safe';

function fileSizeWrapper(bytes) {
  return filesize(bytes, { base: 10 });
}

function sizePercent(fsBytes, refBytes) {
  const percent = Math.floor(10000 * (1 - (refBytes / fsBytes))) / 100;
  const prefix = percent > 0 ? '+' : '';
  return grey(`${prefix}${percent}%`);
}

function sizeDiff(fsBytes, refBytes) {
  const diff = fsBytes - refBytes;
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

export default function serialize({name, fsBytes, refBytes}) {
  return [
    name,
    sizeRaw(fsBytes),
    sizePercent(fsBytes, refBytes),
    sizeDiff(fsBytes, refBytes)
  ];
}