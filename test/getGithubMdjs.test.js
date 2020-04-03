import { expect } from '@open-wc/testing';
import { getGithubMdjs } from '../src/getGithubMdjs.js';

async function getFromBackground({ url }) {
  let data;
  switch (url) {
    case 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json':
      data = { name: 'demo-wc-card' };
      break;
    case 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/README.md':
      data = '# Root Readme demo-wc-card';
      break;
    case 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md':
      data = '# Docs Readme demo-wc-card';
      break;
    // mono repo example
    case 'https://raw.githubusercontent.com/ing-bank/lion/feat/markdown/packages/tabs/package.json':
      data = { name: '@lion/tabs' };
      break;
    case 'https://raw.githubusercontent.com/ing-bank/lion/feat/markdown/packages/tabs/README.md':
      data = '# Readme lion-tabs';
      break;
    /* no default */
  }
  if (data) {
    return { ok: true, data };
  }
  return { ok: false };
}

describe('getGithubMdjs', () => {
  it('resolves root repo urls correctly', async () => {
    const result = await getGithubMdjs('https://github.com/daKmoR/demo-wc-card', {
      getFromBackground,
    });
    expect(result).to.deep.equal({
      ok: true,
      mdjsUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/README.md',
      mdjs: '# Root Readme demo-wc-card',
      pkgUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master',
      pkgJsonUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json',
      pkgJson: {
        name: 'demo-wc-card',
      },
    });
  });

  it('has an { ok: false } status if no valid data could be gathered', async () => {
    const result = await getGithubMdjs('http://does.not.have.mdjs', {
      getFromBackground,
    });
    expect(result).to.deep.equal({
      ok: false,
    });
  });

  it('resolves correct rootUrl when in a sub directory', async () => {
    const result = await getGithubMdjs(
      'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md',
      {
        getFromBackground,
      },
    );
    expect(result).to.deep.equal({
      ok: true,
      mdjsUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/docs/README.md',
      mdjs: '# Docs Readme demo-wc-card',
      pkgUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master',
      pkgJsonUrl: 'https://raw.githubusercontent.com/daKmoR/demo-wc-card/master/package.json',
      pkgJson: {
        name: 'demo-wc-card',
      },
    });
  });

  it('does support mono repos', async () => {
    const result = await getGithubMdjs(
      'https://github.com/ing-bank/lion/tree/feat/markdown/packages/tabs',
      {
        getFromBackground,
      },
    );
    expect(result).to.deep.equal({
      ok: true,
      mdjsUrl:
        'https://raw.githubusercontent.com/ing-bank/lion/feat/markdown/packages/tabs/README.md',
      mdjs: '# Readme lion-tabs',
      pkgUrl: 'https://raw.githubusercontent.com/ing-bank/lion/feat/markdown/packages/tabs',
      pkgJsonUrl:
        'https://raw.githubusercontent.com/ing-bank/lion/feat/markdown/packages/tabs/package.json',
      pkgJson: {
        name: '@lion/tabs',
      },
    });
  });
});
