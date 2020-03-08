import { expect } from '@open-wc/testing';
import { evalModuleCode } from '../src/evalModuleCode.js';

describe('evalModuleCode', () => {
  it('executes code', async () => {
    window.__evalModuleCodeData = 'manual';
    await evalModuleCode("window.__evalModuleCodeData = 'via eval';");
    expect(window.__evalModuleCodeData).to.equal('via eval');
    delete window.__evalModuleCodeData;
  });

  it('executes in isolated modules', async () => {
    window.__evalModuleCodeData = 'manual';
    await evalModuleCode("const foo = 1; window.__evalModuleCodeData = 'via eval' + foo;");
    expect(window.__evalModuleCodeData).to.equal('via eval1');
    // defining a second "const foo" would throw in the same module
    await evalModuleCode("const foo = 2; window.__evalModuleCodeData = 'via eval' + foo;");
    expect(window.__evalModuleCodeData).to.equal('via eval2');
    delete window.__evalModuleCodeData;
  });
});
