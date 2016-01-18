import test from 'tape';
import sinon from 'sinon';
import { rewireFileAccess } from './testutils';

import { processFiles, printToConsole, __RewireAPI__ as CodeweightRewireAPI } from '../src/codeweight';

test('processFiles file content reading', async assert => {
  const { rewireReset } = rewireFileAccess(CodeweightRewireAPI);

  const actual = await processFiles({ files: [{ path: 'package.json' }] });
  const expected = [{name: 'package.json', fsBytes: 1549, revBytes: 1239}];
  assert.deepEqual(actual, expected,
    'should read the same file on both the filesystem and git reference.');

  rewireReset();
  assert.end();
});

test('processFiles file\'s gzip option', async assert => {
  const { rewireReset } = rewireFileAccess(CodeweightRewireAPI);

  const actual1 = await processFiles({ files: [{ path: 'package.json' }] });
  const expected1 = [{name: 'package.json', fsBytes: 1549, revBytes: 1239}];
  assert.deepEqual(actual1, expected1,
    'should default to false if not provided.');

  const actual2 = await processFiles({ files: [{ path: 'package.json', gzip: true }] });
  const expected2 = [{name: 'package.json (gzipped)', fsBytes: 65, revBytes: 69}];
  assert.deepEqual(actual2, expected2);

  rewireReset();
  assert.end();
});

test('processFiles ref option', async assert => {
  const { rewireReset, showStub } = rewireFileAccess(CodeweightRewireAPI);

  await processFiles({ files: [{ path: 'package.json' }] });

  const actual1 = showStub.firstCall.args[0][0];
  const expected1 = 'HEAD:package.json';
  assert.equal(actual1, expected1,
    'should default to "HEAD" if not provided.');
  showStub.reset();

  await processFiles({ files: [{ path: 'package.json' }], rev: 'master' });

  const actual2 = showStub.firstCall.args[0][0];
  const expected2 = 'master:package.json';

  assert.equal(actual2, expected2,
    'should be used to get the git file content.');

  rewireReset();
  assert.end();
});

test('processFiles file\'s name option', async assert => {
  const { rewireReset } = rewireFileAccess(CodeweightRewireAPI);

  const [{ name: actual1 }] = await processFiles({ files: [{ path: 'package.json' }] });
  const expected1 = 'package.json';
  assert.equal(actual1, expected1,
    'should default to the path property if not provided.');

  const [{ name: actual2 }] = await processFiles({ files: [{ path: 'package.json', name: 'PACKAGE' }] });
  const expected2 = 'PACKAGE';
  assert.equal(actual2, expected2,
    'should set the name property in the output entry for the file.');

  rewireReset();
  assert.end();
});

test('processFiles file\'s path option', async assert => {
  const { rewireReset, showStub, readFileStub } = rewireFileAccess(CodeweightRewireAPI);

  await processFiles({ files: [{ path: 'testPath' }] });

  const actual1 = readFileStub.firstCall.args[0];
  const expected1 = '/root/testPath';

  assert.equal(actual1, expected1,
    'should be appeneded to the git root path and used with fs.readFile');

  const actual2 = showStub.firstCall.args[0][0];
  const expected2 = 'HEAD:testPath';

  assert.equal(actual2, expected2,
    'should be appended to the target option to be used with git.revparse');

  rewireReset();
  assert.end();
});