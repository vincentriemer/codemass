import sinon from 'sinon';
import Promise from 'bluebird';
import lorem from 'lorem-ipsum';

const fsLorem = lorem({ count: 50, random: () => 0.5 });
const gitLorem = lorem({ count: 40, random: () => 0.5 });
const gzipLorem = lorem({ count: 2, random: () => 0.5 });

export function rewireSpy(RewireAPI, target) {
  const spy = sinon.spy(RewireAPI.__get__(target));
  RewireAPI.__set__(target, spy);
  return spy;
}

export function resetRewiredSpy(RewireAPI, target) {
  RewireAPI.__ResetDependency__(target);
}

export function rewireFileAccess(RewireAPI) {
  const readFileStub = sinon.stub().returns(Promise.resolve(fsLorem));
  const showStub = sinon.stub().returns(Promise.resolve(gitLorem));

  RewireAPI.__set__('promisedRevParse', () => '/root/');
  RewireAPI.__set__('promisedReadFile', readFileStub);
  RewireAPI.__set__('promisedShow', showStub);

  const rewireReset = () => {
    RewireAPI.__ResetDependency__('promisedRevParse');
    RewireAPI.__ResetDependency__('promisedReadFile');
    RewireAPI.__ResetDependency__('promisedShow');
  };

  return { readFileStub, showStub, rewireReset };
}

export function rewireGzip(RewireAPI) {
  const gzipStub = sinon.stub().returns(Promise.resolve(gzipLorem));

  RewireAPI.__set__('promisedGzip', gzipStub);

  const reset = () => {
    RewireAPI.__ResetDependency__('promisedGzip');
  };

  return { gzipStub, reset };
}
