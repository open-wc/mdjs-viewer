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
      // - `'unsafe-eval'` to allow [wasm](https://webassembly.org/) to analyze the code (moving action background will remove that need)
      // - `'unsafe-inline'` to execute code within the mdjs iframe
      // - `unpkg.com` to load dependencies from
      value = value.replace('script-src', "script-src 'unsafe-eval' 'unsafe-inline' unpkg.com");
      // adds to connect-src
      // - `raw.githubusercontent.com` to fetch raw md content and package.json
      value = value.replace('connect-src', 'connect-src raw.githubusercontent.com');
      // adds to frame-src
      // - `data:` to enable setting the content of the mdjs iframe
      value = value.replace('frame-src', 'frame-src data:');
      // adds to style-src
      // - raw.githubusercontent.com to fetch raw md content and package.json
      value = value.replace('style-src', 'style-src unpkg.com');
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
