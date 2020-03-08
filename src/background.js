/* global chrome */

// chrome.browserAction.onClicked.addListener(async tab => {
//   // Send a message to the active tab
//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     const activeTab = tabs[0];
//     // chrome.tabs.sendMessage(activeTab.id, {
//     //   message: "clicked_browser_action"
//     // });
//   });
// });

function onHeadersReceived(details) {
  const responseHeaders = [];
  for (const header of details.responseHeaders) {
    const { name } = header;
    let { value } = header;
    if (name.toLowerCase() === 'content-security-policy') {
      // adds to script-src
      // - 'unsafe-eval' for wasm of es-module-lexer
      // - data: for evalModuleCode.js
      // - unpkg.com to load dependencies
      value = value.replace('script-src', "script-src 'unsafe-eval' data: unpkg.com");
      // adds to connect-src
      // - raw.githubusercontent.com to fetch raw md content and package.json
      value = value.replace('connect-src', 'connect-src raw.githubusercontent.com');
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
