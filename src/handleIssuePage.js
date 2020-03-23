/* eslint-disable no-await-in-loop */
import { isMdjsContentFork } from './isMdjsContentFork.js';
import { createViewer } from './createViewer.js';
import { createTriggerViewer } from './createTriggerViewer.js';
import { createLazyTriggerViewer } from './createLazyTriggerViewer.js';

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
    '.unminimized-comment .js-preview-tab, .discussion-timeline-actions .js-preview-tab, .timeline-new-comment .js-preview-tab',
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

/**
 * Converts an issue url to the api call
 *
 * from: https://github.com/TheUser/the-repo-name/issues/1
 * to: https://api.github.com/repos/TheUser/the-repo-name/issues/1
 *
 * @param {string} urlString
 */
function getIssueUrl(urlString) {
  const url = new URL(urlString);
  url.host = 'api.github.com';
  url.pathname = `/repos${url.pathname}`;
  return url;
}

export async function handleIssuePage({ url = document.location.href, node = document } = {}) {
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
      // issues or comments we have write access to (e.g. there is a textarea)
      const issueBody = issueMsgNode.querySelector('.d-block.js-comment-body');
      issueBody.style.position = 'relative';
      let text = textarea.value;
      if (text.includes('_Originally posted by')) {
        text = text.substring(0, text.indexOf('_Originally posted by'));
      }
      const button = createTriggerViewer(text, {
        type: 'issue-show',
      });
      issueBody.appendChild(button);
    } else {
      // issues or comments we need to fetch the raw md from github api
      const hasJsCode = issueMsgNode.querySelector('.highlight-source-js');
      if (hasJsCode) {
        // potentially could be a story so place button to not need
        const issueBody = issueMsgNode.querySelector('.d-block.js-comment-body');
        issueBody.style.position = 'relative';
        const button = createLazyTriggerViewer(getIssueUrl(url), {
          type: 'issue-show',
        });
        issueBody.appendChild(button);
      }
    }
  }
}
