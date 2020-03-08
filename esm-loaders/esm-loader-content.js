/* global chrome */

// This file is a workaround to be able to use es modules
const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.extension.getURL('./src/content.js'));
const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
head.insertBefore(script, head.lastChild);
