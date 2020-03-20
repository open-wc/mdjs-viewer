# Markdown JavaScript Viewer (mdjs-viewer)

This is a POC of a chrome extension.

It allows to view and use [mdjs](https://www.npmjs.com/package/@mdjs/core) directly on github.com.

You can see live demos in

- Markdown files (like README.md)
- Issues
- Preview of new issues
- ... more is planned but not yet implemented

## Security

This extension takes care of security by

- not executing any code without user action (e.g. requires a click of a button first)
- shows demos/executes code within an iframe
  - that uses [sandbox](https://www.w3schools.com/tags/att_iframe_sandbox.asp) with the following settings `sandbox="allow-scripts"`
  - populates the iframe with a data uri
  - does not allow any requests (except unpkg) to got outside of the iframe

This prevents [all known attack vectors](https://github.com/open-wc/mdjs-viewer/issues/2). If you come up with new once please [report them](https://github.com/open-wc/mdjs-viewer/issues/new).

### Warning

In order to function this extension modifies the CSP (Content Security Policy) for github.com with the following rules:

- adds to script-src
  - `'unsafe-inline'` to execute code blocks within the mdjs iframe
  - `unpkg.com` to load user dependencies from within the mdjs iframe

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

It adds a button `show demo ▹` to markdown pages and issues. Once you press it will get the raw md text which then gets pass though [mdjs](https://www.npmjs.com/package/@mdjs/core) and an extra plugin which replaces all imports (relative and bare imports) with [unpkg.com](https://unpkg.com/) urls with the `?module` flag. This way all dependencies can be directly loaded in the browser without the need of any service.

Finally we create an iframe with the content of the mdjs html and js output.

## Issues/ToDos/Future work

- Even more security checks
- Support relative imports from not root md files
- Support relative links
- Support github page switches (without manual reload)
- Support in github pull request
- Support npmjs
- Support gitlab
- Allow users to define on which urls mdjs-viewer gets loaded/executed
