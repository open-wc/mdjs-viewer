import { expect } from '@open-wc/testing';
import { getPkgJsonUrl } from '../src/getPkgJsonUrl.js';

describe('getPkgJsonUrl', () => {
  it('resolves root package.json when on root of Repo', async () => {
    expect(getPkgJsonUrl('https://github.com/daKmoR/demo-wc-card').href).to.equal(
      'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json',
    );
  });

  it('resolves root package.json when not on root of Repo', async () => {
    expect(getPkgJsonUrl('https://github.com/daKmoR/demo-wc-card/tree/master/docs').href).to.equal(
      'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json',
    );
  });

  it('resolves root package.json when on a markdown file directly', async () => {
    expect(
      getPkgJsonUrl('https://github.com/daKmoR/demo-wc-card/blob/master/docs/variations.md').href,
    ).to.equal('https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json');

    expect(
      getPkgJsonUrl('https://github.com/daKmoR/demo-wc-card/blob/master/README.md').href,
    ).to.equal('https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json');
  });
});
