import { isMdjsContent, mdjsProcess, resolveToUnpkg } from '../dist/index.js';
import { evalModuleCode } from './evalModuleCode.js';

function getPkgJsonUrl(urlString) {
  const lengthToFirstSlashAfterBlob = urlString.indexOf('/', urlString.indexOf('blob/') + 5);
  const pathWithBlob = `${urlString.substring(0, lengthToFirstSlashAfterBlob)}/package.json`;
  const url = new URL(urlString);
  url.host = 'raw.githubusercontent.com';
  url.pathname = pathWithBlob.replace('/blob', '');
  return url;
}

function getMdjsUrl(urlString) {
  const url = new URL(urlString);
  url.host = 'raw.githubusercontent.com';
  url.pathname = url.pathname.replace('/blob', '');
  return url;
}

export async function handleMarkdownPage() {
  const url = document.location.href;
  const currentUrl = url.includes('/blob/') ? url : `${url}/blob/master/README.md`;
  const mdBody = document.querySelector('#readme .markdown-body');
  if (mdBody) {
    const responseMdjs = await fetch(getMdjsUrl(currentUrl));
    const responsePkgJson = await fetch(getPkgJsonUrl(currentUrl));

    // if HTTP-status is 200-299
    if (responseMdjs.ok && responsePkgJson.ok) {
      const text = await responseMdjs.text();
      if (isMdjsContent(text)) {
        const pkgJson = await responsePkgJson.json();
        const data = await mdjsProcess(text);
        mdBody.innerHTML = data.html;
        const executeCode = await resolveToUnpkg(data.jsCode, pkgJson);
        await evalModuleCode(executeCode);
      }
    }
  }
}
