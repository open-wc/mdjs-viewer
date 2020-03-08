/* eslint-disable no-await-in-loop */
import { isMdjsContent, resolveToUnpkg, mdjsProcess } from '../dist/index.js';
import { evalModuleCode } from './evalModuleCode.js';

function childMutationToHappen(node) {
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      observer.disconnect();
      resolve();
    });
    observer.observe(node, { childList: true });
  });
}

function handleNewCommentPreview() {
  const previewButton = document.querySelector('.discussion-timeline-actions .js-preview-tab');
  if (!previewButton) {
    return;
  }
  const rootNodeQueryCode = `document.querySelector(".discussion-timeline-actions .js-preview-body")`;
  const textarea = document.querySelector('[name=comment\\[body\\]]');
  const previewBody = document.querySelector('.discussion-timeline-actions .js-preview-body');
  previewButton.addEventListener('click', () => {
    (async () => {
      if (textarea && textarea.value && isMdjsContent(textarea.value)) {
        const data = await mdjsProcess(textarea.value, {
          rootNodeQueryCode,
        });
        await childMutationToHappen(previewBody);
        previewBody.innerHTML = data.html;

        const executeCode = await resolveToUnpkg(data.jsCode);
        await evalModuleCode(executeCode, true);
      }
    })();
  });
}

export async function handleIssuePage() {
  handleNewCommentPreview();

  const issueMsgNodes = document.querySelectorAll('.TimelineItem');
  if (issueMsgNodes.length === 0) {
    return;
  }

  let i = 0;
  for (const issueMsgNode of issueMsgNodes) {
    const textarea = issueMsgNode.querySelector(
      '[name=issue_comment\\[body\\]], [name=issue\\[body\\]], [name=commit_comment\\[body\\]], [name=pull_request\\[body\\]]',
    );
    if (textarea && textarea.value && isMdjsContent(textarea.value)) {
      const data = await mdjsProcess(textarea.value, {
        rootNodeQueryCode: `document.querySelectorAll(".TimelineItem")[${i}]`,
      });
      const issueBody = issueMsgNode.querySelector('.d-block.js-comment-body');
      issueBody.innerHTML = data.html;

      const executeCode = await resolveToUnpkg(data.jsCode);
      evalModuleCode(executeCode);
    }
    i += 1;
  }
}
