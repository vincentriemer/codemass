import { gzip } from 'zlib';
import { readFile } from 'fs';
import { join } from 'path';

import SimpleGit from 'simple-git';
import Promise from 'bluebird';
import Table from 'cli-table';
import { yellow } from 'colors';

import serialize from './serialize';

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
    'padding-left': 3,
    'padding-right': 0
  }
};

const defaultTarget = 'HEAD';

function calculateBytes(contentsArray) {
  return contentsArray.map(Buffer.byteLength);
}

function processFile (target) {
  return async function({path, gzip = false, name = path}) {
    // get git toplevel
    const topLevel = await promisedRevParse(['--show-toplevel']);

    // get the local file size
    const fsContent = await promisedReadFile(join(topLevel.trim(), path));

    // get the git master file size
    const branchContent = await promisedShow([`${target}:${path}`]);

    if (gzip) {
      // gzip contents
      const fsGzipContent = await promisedGzip(fsContent);
      const branchGzipContent = await promisedGzip(branchContent);

      const [fsBytes, branchBytes] = calculateBytes([fsGzipContent, branchGzipContent]);
      return { name: `${name} (gizpped)`, fsBytes, branchBytes };
    } else {
      const [fsBytes, branchBytes] = calculateBytes([fsContent, branchContent]);
      return {name, fsBytes, branchBytes};
    }
  }
}

function printResults(target) {
  return results => {
    let outputTable = new Table(tableConfig);
    outputTable.push(...results);

    console.log(`
Size differences since ${yellow(target)}

${outputTable.toString()}
    `);
  }
}

export async function processFiles({ files, target = defaultTarget}) {
  try {
    return await Promise.map(files, processFile(target));
  } catch (err) {
    // TODO: Write better errors
    console.error(err.stack);
  }
}

export async function printToConsole(processedFiles, target = defaultTarget) {
  try {
    const serializedResult = await Promise.map(processedFiles, serialize);
    printResults(target)(serializedResult);
  } catch (err) {
    // TODO: Write better errors
    console.error(err.stack);
  }
}
