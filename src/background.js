/* global chrome */
import { resolveToUnpkg, mdjsProcess } from '../dist/index.js';

// chrome.browserAction.onClicked.addListener(async tab => {
//   // Send a message to the active tab
//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     const activeTab = tabs[0];
//     // chrome.tabs.sendMessage(activeTab.id, {
//     //   message: "clicked_browser_action"
//     // });
//   });
// });

chrome.runtime.onMessage.addListener(({ action, ...options }, sender, sendResponse) => {
  if (action === 'mdjs+unpkg') {
    const { mdjs, pkgJson } = options;
    (async () => {
      const data = await mdjsProcess(mdjs);
      const executeCode = await resolveToUnpkg(data.jsCode, pkgJson);
      sendResponse({ jsCode: executeCode, html: data.html });
    })();
  }
  if (action === 'fetch') {
    const { url, fetchProcess } = options;
    (async () => {
      const response = await fetch(url);

      // if HTTP-status is 200-299
      if (response.ok) {
        let data;
        switch (fetchProcess) {
          case 'text':
            data = await response.text();
            break;
          case 'json':
            data = await response.json();
            break;
          /* no default */
        }
        sendResponse({ ok: response.ok, data });
      } else {
        sendResponse({ ok: response.ok });
      }
    })();
  }

  // mark this message as async
  return true;
});

function onHeadersReceived(details) {
  const responseHeaders = [];
  for (const header of details.responseHeaders) {
    const { name } = header;
    let { value } = header;
    if (name.toLowerCase() === 'content-security-policy') {
      // adds to script-src
      // - `'unsafe-inline'` to execute code blocks within the mdjs iframe
      // - `unpkg.com` to load user dependencies from within the mdjs iframe
      value = value.replace('script-src', "script-src 'unsafe-inline' unpkg.com");
    }
    responseHeaders.push({ name, value });
  }
  return {
    responseHeaders,
  };
}

const filter = {
  urls: ['https://github.com/*'],
  types: ['main_frame', 'sub_frame'],
};

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, [
  'blocking',
  'responseHeaders',
]);
