# Markdown JavaScript Viewer (mdjs-viewer)

This is a POC of a chrome extension.

It allows to view and use [mdjs](https://www.npmjs.com/package/@mdjs/core) directly on github.com.

You can see live demos in

- Markdown files (like README.md)
- Issues
- Preview of new issues
- ... more is planned but not yet implemented

## Warning

This extension modifies the CSP (Content Security Policy) for github.com with the following rules:

- adds to script-src
  - `'unsafe-eval'` to allow [wasm](https://webassembly.org/) as it is used to analyze the code
  - `data:` so code can be executed as individual modules (for issues)
  - `unpkg.com` to load dependencies from
- adds to connect-src
  - `raw.githubusercontent.com` to fetch raw md content and package.json

## Installation

1. Download

   ```bash
   git clone https://github.com/open-wc/mdjs-viewer.git
   cd mdjs-viewer
   yarn
   ```

2. Go to Chrome Extensions (More Tools -> Extensions or chrome://extensions/)
3. Enable "Developer Mode" at the right top
4. Load unpacked at left top and select the mdjs-viewer

## Demos

Enable the extension and visit the following pages

1. [Readme of demo-wc-card](https://github.com/daKmoR/demo-wc-card)
2. [Issues of demo-wc-card](https://github.com/daKmoR/demo-wc-card/issues/1)

## How does it work?

First we need to get the raw md text which we then pass though [mdjs](https://www.npmjs.com/package/@mdjs/core) and an extra plugin which replaces all imports (relative and bare imports) with [unpkg.com](https://unpkg.com/) urls with the `?module` flag. This way all dependencies can be directly loaded in the browser without the need of any service.

Finally mdjs gives us a separate html and js output. The html we write directly into the page and the js code we execute in it's one module context. This means your demos are directly available within the page where the markdown is.

## Issues/ToDos/Future work

- Security review!!!
- Support preview when editing issues
- Support relative imports from not root md files
- Support relative links
- Support github page switches (without manual reload)
- Do the mdjs processing in the "background" (extension context or web worker) and not in the content window
- Support in github pull request
- Support npmjs
- Support gitlab
- Allow to define on which pages mdjs gets executed
