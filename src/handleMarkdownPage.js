import { isMdjsContentFork } from './isMdjsContentFork.js';
import { createTriggerViewer } from './createTriggerViewer.js';
import { getGithubMdjs } from './getGithubMdjs.js';

export async function handleMarkdownPage({ url = document.location.href, root = document } = {}) {
  const mdBody = root.querySelector('#readme .markdown-body');
  if (mdBody) {
    const response = await getGithubMdjs(url);

    // if HTTP-status is 200-299
    if (response.ok) {
      const { mdjs, pkgJson, mdjsUrl, pkgUrl } = response;
      if (isMdjsContentFork(mdjs)) {
        mdBody.style.position = 'relative';
        const viewer = createTriggerViewer(mdjs, {
          type: 'readme-show',
          pkgJson,
          urlData: {
            fileUrl: mdjsUrl,
            rootUrl: pkgUrl,
          },
        });
        mdBody.appendChild(viewer);
      }
    }
  }
}
