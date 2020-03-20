/* eslint-disable no-await-in-loop */
import { isMdjsContentFork } from './isMdjsContentFork.js';
import { createViewer } from './createViewer.js';
import { createTriggerViewer } from './createTriggerViewer.js';

function childMutationToHappen(node) {
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      observer.disconnect();
      resolve();
    });
    observer.observe(node, { childList: true });
  });
}

function handleCommentPreviews() {
  const previewButtons = document.querySelectorAll(
    '.unminimized-comment .js-preview-tab, .discussion-timeline-actions .js-preview-tab',
  );
  for (const previewButton of previewButtons) {
    previewButton.addEventListener('click', ev => {
      const textarea = ev.target.parentElement.parentElement.parentElement.querySelector(
        'textarea',
      );
      const previewBody = ev.target.parentElement.parentElement.parentElement.querySelector(
        '.js-preview-body',
      );

      if (textarea && textarea.value && isMdjsContentFork(textarea.value)) {
        childMutationToHappen(previewBody).then(() => {
          const dimensions = previewBody.getBoundingClientRect();
          createViewer(textarea.value, {
            type: 'issue-preview',
            width: dimensions.width,
            height: dimensions.height,
          }).then(viewer => {
            previewBody.innerHTML = '';
            previewBody.appendChild(viewer.iframe);
          });
        });
      }
    });
  }
}

export async function handleIssuePage({ node = document } = {}) {
  handleCommentPreviews();

  const issueMsgNodes = node.querySelectorAll('.TimelineItem');
  if (issueMsgNodes.length === 0) {
    return;
  }

  for (const issueMsgNode of issueMsgNodes) {
    const textarea = issueMsgNode.querySelector(
      '[name=issue_comment\\[body\\]], [name=issue\\[body\\]], [name=commit_comment\\[body\\]], [name=pull_request\\[body\\]]',
    );
    if (textarea && textarea.value && isMdjsContentFork(textarea.value)) {
      const issueBody = issueMsgNode.querySelector('.d-block.js-comment-body');
      issueBody.style.position = 'relative';
      const button = createTriggerViewer(textarea.value, {
        type: 'issue-show',
      });
      issueBody.appendChild(button);
    }
  }
}
