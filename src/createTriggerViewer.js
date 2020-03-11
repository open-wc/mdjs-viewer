import { createViewer } from './createViewer.js';

export function createTriggerViewer(text, { type, pkgJson = {} }) {
  const button = document.createElement('button');
  button.innerText = 'show demo ▹';
  button.style.position = 'absolute';
  button.style.top = '15px';
  button.style.right = '15px';
  button.style.zIndex = 100;

  button.addEventListener('click', async ev => {
    if (!ev.target.hasAttribute('for-iframe-viewer-id')) {
      const issueBody = ev.target.parentElement;
      const dimensions = issueBody.getBoundingClientRect();
      const addViewer = await createViewer(text, {
        type,
        width: dimensions.width,
        height: dimensions.height,
        pkgJson,
      });
      issueBody.appendChild(addViewer.iframe);
      ev.target.setAttribute('for-iframe-viewer-id', addViewer.id);
    }

    let showIframe = ev.target.hasAttribute('show-iframe');
    const iframeViewerId = ev.target.getAttribute('for-iframe-viewer-id');
    const viewer = document.body.querySelector(`[iframe-viewer-id="${iframeViewerId}"]`);
    showIframe = !showIframe;
    if (showIframe) {
      viewer.style.display = 'block';
      button.innerText = 'show mdjs ｘ';
      ev.target.setAttribute('show-iframe', '');
    } else {
      viewer.style.display = 'none';
      button.innerText = 'show demo ▹';
      ev.target.removeAttribute('show-iframe');
    }
  });
  return button;
}
