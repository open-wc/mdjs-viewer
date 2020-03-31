import { expect } from '@open-wc/testing';
import { getGithubUrlData } from '../src/getGithubUrlData.js';

describe('getGithubUrlData', () => {
  it('resolves root README.md when on root of Repo', async () => {
    expect(
      getGithubUrlData('https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/README.md'),
    ).to.deep.equal({
      fileUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/README.md',
      rootUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/',
    });

    expect(
      getGithubUrlData('https://raw.githubusercontent.com/open-wc/open-wc/master/README.md'),
    ).to.deep.equal({
      fileUrl: 'https://raw.githubusercontent.com/open-wc/open-wc/master/README.md',
      rootUrl: 'https://raw.githubusercontent.com/open-wc/open-wc/master/',
    });
  });

  it('resolves correct rootUrl when in a sub directory', async () => {
    expect(
      getGithubUrlData(
        'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md',
      ),
    ).to.deep.equal({
      fileUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md',
      rootUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/',
    });
  });
});
