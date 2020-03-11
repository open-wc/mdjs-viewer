import { resolveToUnpkg, mdjsProcess } from '../dist/index.js';

let counter = 0;

export async function createViewer(mdjs, { type, width, height, pkgJson = {} }) {
  counter += 1;
  const data = await mdjsProcess(mdjs);
  const executeCode = await resolveToUnpkg(data.jsCode, pkgJson);
  const iframeViewer = document.createElement('iframe');
  const iframeContent = `
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/github-markdown-css@4.0.0/github-markdown.css">
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
      ${executeCode}
    </script>
    <body>
      <div class="markdown-body">
        ${data.html}
      </div>
    </body>
  `;

  iframeViewer.src = `data:text/html;charset=utf-8,${escape(iframeContent)}`;

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
  iframeViewer.setAttribute('iframe-viewer-id', counter);
  return { iframe: iframeViewer, id: counter };
}
