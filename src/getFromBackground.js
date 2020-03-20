/* global chrome */

export function getFromBackground(options) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(options, response => {
      resolve(response);
    });
  });
}
