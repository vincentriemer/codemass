import { gzip } from 'zlib';
import { readFile } from 'fs';
import { join } from 'path';

import SimpleGit from 'simple-git';
import Promise from 'bluebird';
import Table from 'cli-table';
import { yellow } from 'colors/safe';

import serialize from './serialize';
import { throwError } from './utils';

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

const defaultRef = 'HEAD';

export async function getSize(path, gzip = false, ref = null) {
  let content = null;

  // get size from local filesystem
  if (ref == null) {
    const topLevel = await promisedRevParse(['--show-toplevel']);
    content = await promisedReadFile(join(topLevel.trim(), path));
  }
  // get size from git reference
  else {
    content = await promisedShow([`${ref}:${path}`]);
  }

  // gzip content if flag is set
  if (gzip) {
    content = await promisedGzip(content);
  }

  return Buffer.byteLength(content);
}

function printResults (ref) {
  return results => {
    let outputTable = new Table(tableConfig);
    outputTable.push(...results);

    console.log(`
Size differences since ${yellow(ref)}

${outputTable.toString()}
    `);
  }
}

function processFile (ref) {
  return async function ({path, gzip = false, name = path}) {
    let outputName = name;

    if (gzip) {
      outputName += ' (gzipped)';
    }

    return {
      name: outputName,
      fsBytes: await getSize(path, gzip),
      branchBytes: await getSize(path, gzip, ref)
    };
  }
}

export async function processFiles ({ files = throwError('no files property defined'), ref = defaultRef}) {
  try {
    return await Promise.map(files, processFile(ref));
  } catch (err) {
    // TODO: Write better errors
    console.error(err.stack);
  }
}

export async function printToConsole (processedFiles = throwError('processedFiles is not defined'), ref = defaultRef) {
  try {
    const serializedResult = await Promise.map(processedFiles, serialize);
    printResults(ref)(serializedResult);
  } catch (err) {
    // TODO: Write better errors
    console.error(err.stack);
  }
}
