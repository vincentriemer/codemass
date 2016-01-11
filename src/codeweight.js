import { gzip } from 'zlib';
import { readFile } from 'fs';
import { join } from 'path';

import SimpleGit from 'simple-git';
import Promise from 'bluebird';
import filesize from 'filesize';
import Table from 'cli-table';
import { grey, green, red, cyan } from 'colors';

import { throwError } from './utilities';

const git = SimpleGit();

const promisedShow = Promise.promisify(git.show, { context: git });
const promisedRevParse = Promise.promisify(git.revparse, { context: git });
const promisedReadFile = Promise.promisify(readFile);
const promisedGzip = Promise.promisify(gzip);

const tableConfig = {
  chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
    , 'right': '' , 'right-mid': '' , 'middle': ' ' },
  head: ['File', 'Size', 'Percent', 'Diff'],
  style: {
    head: ['magenta'],
    'padding-left': 0,
    'padding-right': 5
  }
};

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

function serializeResult({name, fsBytes, branchBytes}) {
  return [name, sizeRaw(fsBytes), sizePercent(fsBytes, branchBytes), sizeDiff(fsBytes, branchBytes)];
}

function processFile (branch) {
  return async function({path, gzip = false, name = path}) {
    // get git toplevel
    const topLevel = await promisedRevParse(['--show-toplevel']);

    // get the local file size
    const fsContent = await promisedReadFile(join(topLevel.trim(), path));

    // get the git master file size
    const branchContent = await promisedShow([`${branch}:${path}`]);

    if (gzip) {
      // gzip contents
      const fsGzipContent = await promisedGzip(fsContent);
      const branchGzipContent = await promisedGzip(branchContent);

      // calcaulate bytes
      const fsBytes = Buffer.byteLength(fsGzipContent);
      const branchBytes = Buffer.byteLength(branchGzipContent);

      return { name: `${name} (gizpped)`, fsBytes, branchBytes };
    } else {
      // calculate bytes
      const fsBytes = Buffer.byteLength(fsContent);
      const branchBytes = Buffer.byteLength(branchContent);

      return {name, fsBytes, branchBytes};
    }
  }
}

function printResults(results) {
  let outputTable = new Table(tableConfig);
  outputTable.push(...results);
  console.log(outputTable.toString());
}

export async function processFiles({ files, branch = 'master'}) {
  return await Promise.map(files, processFile(branch)).catch(throwError);
}

export async function printToConsole(processedFiles) {
  await Promise.map(processedFiles, serializeResult).then(printResults).catch(throwError);
}