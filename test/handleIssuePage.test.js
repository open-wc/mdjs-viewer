import { expect, fixture, html } from '@open-wc/testing';
import { handleIssuePage } from '../src/handleIssuePage.js';

describe('handleIssuePage', () => {
  it('places a trigger button into the content', async () => {
    const issuePage = await fixture(html`
      <div>
        <div class="TimelineItem">
          <textarea name="issue_comment[body]">
## hey there          
\`\`\`js story
export const usage = () => {
  return html\`
    <demo-wc-card></demo-wc-card>
  \`;
};
\`\`\`
        </textarea
          >
          <div class="d-block js-comment-body"></div>
        </div>
      </div>
    `);

    await handleIssuePage({ node: issuePage });

    const output = issuePage.querySelector('.js-comment-body');

    expect(output).dom.to.equal(`
      <div class="d-block js-comment-body" style="position: relative;">
        <button style="position: absolute; top: 15px; right: 15px; z-index: 100;">show demo ▹</button>
      </div>
    `);
  });
});
