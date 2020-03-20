/* global chrome */

// This file is a workaround to be able to use es modules
(async () => {
  const src = chrome.extension.getURL('./src/content.js');
  const contentMain = await import(src);
  contentMain.main();
})();
