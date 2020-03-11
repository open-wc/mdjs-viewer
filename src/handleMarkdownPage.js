import { isMdjsContent } from '../dist/index.js';
import { createTriggerViewer } from './createTriggerViewer.js';

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

export async function handleMarkdownPage({ url = document.location.href, root = document } = {}) {
  const fetchUrl = url.includes('/blob/') ? url : `${url}/blob/master/README.md`;
  const mdBody = root.querySelector('#readme .markdown-body');
  if (mdBody) {
    const responseMdjs = await fetch(getMdjsUrl(fetchUrl));
    const responsePkgJson = await fetch(getPkgJsonUrl(fetchUrl));

    // if HTTP-status is 200-299
    if (responseMdjs.ok && responsePkgJson.ok) {
      const text = await responseMdjs.text();
      if (isMdjsContent(text)) {
        mdBody.style.position = 'relative';
        const pkgJson = await responsePkgJson.json();
        const viewer = createTriggerViewer(text, { type: 'readme-show', pkgJson });
        mdBody.appendChild(viewer);
      }
    }
  }
}
