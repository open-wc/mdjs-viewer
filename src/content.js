import { handleIssuePage } from './handleIssuePage.js';
import { handleMarkdownPage } from './handleMarkdownPage.js';

async function main() {
  await handleIssuePage();
  await handleMarkdownPage();
}

main();
