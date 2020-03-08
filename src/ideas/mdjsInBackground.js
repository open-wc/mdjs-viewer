// // ******** content.js
// function getFromBackground(options) {
//   return new Promise((resolve, reject) => {
//     chrome.runtime.sendMessage(options, response => {
//       resolve(response);
//     });
//   });
// }
//
// const response = await getFromBackground({
//   action: "github-issue",
//   mdjs
// });

// // ******** background.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.action === "github-issue") {
//     return "<h1>boom</h1>";
//   }
// });
