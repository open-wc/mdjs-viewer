import { expect } from '@open-wc/testing';
import { getMdjsUrl } from '../src/getMdjsUrl.js';

describe('getMdjsUrl', () => {
  it('resolves root README.md when on root of Repo', async () => {
    expect(getMdjsUrl('https://github.com/daKmoR/demo-wc-card').href).to.equal(
      'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/README.md',
    );
  });

  it('resolves relative README.md when in a folder directory', async () => {
    expect(getMdjsUrl('https://github.com/daKmoR/demo-wc-card/tree/master/docs').href).to.equal(
      'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md',
    );
  });

  it('resolves markdown file when on a markdown file directly', async () => {
    expect(
      getMdjsUrl('https://github.com/daKmoR/demo-wc-card/blob/master/docs/variations.md').href,
    ).to.equal('https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/variations.md');

    expect(
      getMdjsUrl('https://github.com/daKmoR/demo-wc-card/blob/master/docs/README.md').href,
    ).to.equal('https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md');
  });
});
