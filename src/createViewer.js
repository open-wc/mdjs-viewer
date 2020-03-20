/* global chrome */

import { getFromBackground } from './getFromBackground.js';

let counter = 0;

export async function createViewer(mdjs, { type, width, height, pkgJson = {} }) {
  counter += 1;
  const data = await getFromBackground({
    action: 'mdjs+unpkg',
    mdjs,
    pkgJson,
  });
  const iframeViewer = document.createElement('iframe');
  const iframeContent = `
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${chrome.extension.getURL('./dist/github-markdown.css')}">
    <style>
      body {
        margin: 0;
      }
      .markdown-body {
        box-sizing: border-box;
        max-width: 980px;
        font-size: 14px;
      }
    </style>
    <script type="module">
      const observer = new ResizeObserver(() => {
        const dimensions = document.body.getBoundingClientRect();
        const data = {
          action: '${type}-resize',
          iframeViewerId: ${counter},
          width: dimensions.width,
          height: dimensions.height,
        };
        parent.postMessage(JSON.stringify(data), '*');
      });
      observer.observe(document.body);
      ${data.jsCode}
    </script>
    <body>
      <div class="markdown-body">
        ${data.html}
      </div>
    </body>
  `;

  const position =
    type === 'issue-show' || type === 'readme-show'
      ? `position: absolute; left: 15px; top: 15px;`
      : '';
  iframeViewer.setAttribute(
    'style',
    `
    ${position}
    border: none;
    background: #fff;
    min-width: ${width - 30}px;
    min-height: ${height}px;
  `,
  );
  iframeViewer.setAttribute('sandbox', 'allow-scripts');
  iframeViewer.setAttribute('csp', "script-src unpkg.com 'unsafe-inline'; connect-src 'none'");
  iframeViewer.setAttribute('iframe-viewer-id', counter);

  // Uses a data url as when using srcdoc the iframe csp rules get ignored?
  // iframeViewer.setAttribute('srcdoc', iframeContent);
  iframeViewer.src = `data:text/html;charset=utf-8,${escape(iframeContent)}`;

  return { iframe: iframeViewer, id: counter };
}
