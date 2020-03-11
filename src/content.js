import { handleIssuePage } from './handleIssuePage.js';
import { handleMarkdownPage } from './handleMarkdownPage.js';

async function main() {
  await handleIssuePage();
  await handleMarkdownPage();

  window.addEventListener('message', ev => {
    const data = JSON.parse(ev.data);
    if (
      data.action === 'issue-show-resize' ||
      data.action === 'issue-preview-resize' ||
      data.action === 'readme-show-resize'
    ) {
      const viewer = document.body.querySelector(`[iframe-viewer-id="${data.iframeViewerId}"]`);
      if (viewer) {
        viewer.style.height = `${data.height}px`;
        viewer.style.width = `${data.width - 60}px`;
        if (data.action === 'issue-show-resize' || data.action === 'readme-show-resize') {
          viewer.parentElement.style.minHeight = `${data.height + 30}px`;
          viewer.parentElement.style.minWidth = `${data.width}px`;
        }
      }
    }
  });
}

main();
