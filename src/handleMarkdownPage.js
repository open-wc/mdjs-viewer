import { isMdjsContentFork } from './isMdjsContentFork.js';
import { createTriggerViewer } from './createTriggerViewer.js';
import { getFromBackground } from './getFromBackground.js';
import { getMdjsUrl } from './getMdjsUrl.js';
import { getPkgJsonUrl } from './getPkgJsonUrl.js';
import { getGithubUrlData } from './getGithubUrlData.js';

export async function handleMarkdownPage({ url = document.location.href, root = document } = {}) {
  const fetchUrl = url.includes('/blob/') ? url : `${url}/blob/master/README.md`;
  const mdBody = root.querySelector('#readme .markdown-body');
  if (mdBody) {
    const mdjsUrl = getMdjsUrl(fetchUrl);
    const responseMdjs = await getFromBackground({
      action: 'fetch',
      fetchProcess: 'text',
      url: mdjsUrl,
    });
    const responsePkgJson = await getFromBackground({
      action: 'fetch',
      fetchProcess: 'json',
      url: getPkgJsonUrl(fetchUrl),
    });

    // if HTTP-status is 200-299
    if (responseMdjs.ok && responsePkgJson.ok) {
      const text = await responseMdjs.data;
      if (isMdjsContentFork(text)) {
        mdBody.style.position = 'relative';
        const pkgJson = await responsePkgJson.data;
        const urlData = getGithubUrlData(mdjsUrl.href);
        const viewer = createTriggerViewer(text, { type: 'readme-show', pkgJson, urlData });
        mdBody.appendChild(viewer);
      }
    }
  }
}
