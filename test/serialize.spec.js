import test from 'tape';
import sinon from 'sinon';
import { rewireFileAccess } from './testutils';
import { cyan, grey, green, red } from 'colors/safe';

import serialize from '../src/serialize';

test('serialize output type', assert => {
  const actual = serialize({ name: 'package.json', fsBytes: 50, branchBytes: 100 });

  assert.ok(Array.isArray(actual),
    'should be Array.');

  assert.end();
});

test('serialze name output', assert => {
  const [actual] = serialize({ name: 'package.json', fsBytes: 50, branchBytes: 100 });
  const expected = 'package.json';

  assert.equal(actual, expected, 'should be equal to the name argument passed in.');

  assert.end();
});

test('serialize raw size output', assert => {
  const [,actual] = serialize({ name: 'package.json', fsBytes: 50, branchBytes: 100 });
  const expected = cyan('50 B');

  assert.equal(actual, expected, 'should be a rendered equivalent string of the fsBytes argument.');

  assert.end();
});

test('serialize percent diff output', assert => {
  const [,,actual1] = serialize({ name: 'package.json', fsBytes: 100, branchBytes: 100 });
  const expected1 = grey('0%');

  assert.equal(actual1, expected1, 'should just return 0% with no prefix if there is no difference in size.');

  const [,,actual2] = serialize({ name: 'package.json', fsBytes: 50, branchBytes: 75 });
  const expected2 = grey('-50%');

  assert.equal(actual2, expected2,
    'should return a negative percent when the fs size is less than the branch size.');

  const [,,actual3] = serialize({ name: 'package.json', fsBytes: 100, branchBytes: 50 });
  const expected3 = grey('+50%');

  assert.equal(actual3, expected3,
    'should return a positive percent (with "+" prefixed) when the fs size is greater than the branch size');

  assert.end();
});

test('serialize size diff output', assert => {
  const [,,,actual1] = serialize({ name: 'package.json', fsBytes: 100, branchBytes: 100 });
  const expected1 = '0 B';

  assert.equal(actual1, expected1, 'should just return a white 0 when there is no difference.');

  const [,,,actual2] = serialize({ name: 'package.json', fsBytes: 50, branchBytes: 100 });
  const expected2 = green('-50 B');

  assert.equal(actual2, expected2,
    'should return a green diff string when the fs is less than the branch.');

  const [,,,actual3] = serialize({ name: 'package.json', fsBytes: 100, branchBytes: 50 });
  const expected3 = red('+50 B');

  assert.equal(actual3, expected3,
    'should return a red diff string then the fs is greater than the branch.');

  assert.end();
});

