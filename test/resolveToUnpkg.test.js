import { expect } from '@open-wc/testing';
import { resolveToUnpkg } from '../src/resolveToUnpkg.js';

async function expectThrowsAsync(method, errorMessage) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
}

describe('resolveToUnpkg', () => {
  it('works without a pkgJson for bare imports', async () => {
    const input = "import { html } from 'lit-html';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal("import { html } from 'https://unpkg.com/lit-html?module';");
  });

  it('does not touch absolute urls', async () => {
    const input = "import { html } from 'https://donot/touch/me';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal("import { html } from 'https://donot/touch/me';");
  });

  it('resolves bare imports with path', async () => {
    const input = "import { parser } from 'es-module-lexer/lexer.js';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal(
      "import { parser } from 'https://unpkg.com/es-module-lexer/lexer.js?module';",
    );
  });

  it('resolves bare imports with versions from pkgJson', async () => {
    const input = [
      "import 'lit-html';",
      "import { LitElement } from 'lit-element';",
      "import { foo } from '@bar/baz';",
      "import { parser } from 'es-module-lexer/dist/lexer.js';",
    ].join('\n');
    const pkgJson = {
      name: 'my-el',
      version: '3.3.3',
      dependencies: {
        'lit-html': '~1.1.1',
        'lit-element': '~2.2.2',
        'es-module-lexer': '4.4.4',
        '@bar/baz': '5.5.5',
      },
    };
    const result = await resolveToUnpkg(input, pkgJson);
    expect(result.split('\n')).to.deep.equal([
      "import 'https://unpkg.com/lit-html@~1.1.1?module';",
      "import { LitElement } from 'https://unpkg.com/lit-element@~2.2.2?module';",
      "import { foo } from 'https://unpkg.com/@bar/baz@5.5.5?module';",
      "import { parser } from 'https://unpkg.com/es-module-lexer@4.4.4/dist/lexer.js?module';",
    ]);
  });

  it('resolves bare imports with namespaces', async () => {
    const input = "import { foo } from '@bar/baz';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal("import { foo } from 'https://unpkg.com/@bar/baz?module';");
  });

  it('resolves bare imports with namespaces and path', async () => {
    const input = "import { foo } from '@bar/baz/dist/some.js';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal(
      "import { foo } from 'https://unpkg.com/@bar/baz/dist/some.js?module';",
    );
  });

  it('throws if no urlData is provided while using relative imports', async () => {
    const errorMsg = [
      `Relative URLs require providing urlData with { fileUrl, rootUrl } as a 3rd parameter`,
      `Example: "resolveToUnpkg(code, pkgJson, { fileUrl: 'http://...', rootUrl: 'http://...' })`,
      `Provided: "{"fileUrl":"","rootUrl":""}"`,
    ];
    await expectThrowsAsync(() => resolveToUnpkg("import './some-file.js';"), errorMsg.join('\n'));
  });

  it('resolves relative imports to package.json npm pkg name (requires fileUrl and rootUrl)', async () => {
    const pkgJson = {
      name: 'my-el',
      version: '3.3.3',
    };
    const resultRoot = await resolveToUnpkg("import './some-file.js';", pkgJson, {
      fileUrl: 'http://domain.com/README.md',
      rootUrl: 'http://domain.com',
    });
    expect(resultRoot).to.equal("import 'https://unpkg.com/my-el@3.3.3/some-file.js?module';");

    const resultDocs = await resolveToUnpkg("import '../some-file.js';", pkgJson, {
      fileUrl: 'http://domain.com/docs/README.md',
      rootUrl: 'http://domain.com',
    });
    expect(resultDocs).to.equal("import 'https://unpkg.com/my-el@3.3.3/some-file.js?module';");

    const resultDocsSub = await resolveToUnpkg("import '../foo/some-file.js';", pkgJson, {
      fileUrl: 'http://domain.com/docs/README.md',
      rootUrl: 'http://domain.com',
    });
    expect(resultDocsSub).to.equal(
      "import 'https://unpkg.com/my-el@3.3.3/foo/some-file.js?module';",
    );

    const resultDocsDeep = await resolveToUnpkg("import '../foo/some-file.js';", pkgJson, {
      fileUrl: 'http://domain.com/docs/deep/README.md',
      rootUrl: 'http://domain.com',
    });
    expect(resultDocsDeep).to.equal(
      "import 'https://unpkg.com/my-el@3.3.3/docs/foo/some-file.js?module';",
    );
  });
});
