import filesize from 'filesize';
import { grey, green, red, cyan, yellow } from 'colors';

function fileSizeWrapper(bytes) {
  return filesize(bytes, { base: 10 });
}

function sizePercent(fsBytes, gitBytes) {
  const percent = Math.floor(10000 * (1 - (gitBytes / fsBytes))) / 100;
  const prefix = percent > 0 ? '+' : '';
  return grey(`${prefix}${percent}%`);
}

function sizeDiff(fsBytes, gitBytes) {
  const diff = fsBytes - gitBytes;
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

export default function serialize({name, fsBytes, branchBytes}) {
  return [
    name,
    sizeRaw(fsBytes),
    sizePercent(fsBytes, branchBytes),
    sizeDiff(fsBytes, branchBytes)
  ];
}