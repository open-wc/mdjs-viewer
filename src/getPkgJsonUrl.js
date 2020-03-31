/**
 *
 * @param {string} urlString
 */
export function getPkgJsonUrl(urlString) {
  const url = new URL(urlString);
  url.host = 'raw.githubusercontent.com';
  const { pathname } = url;

  let branch = 'master';
  let repo = pathname.substring(1);
  if (pathname.includes('/tree/')) {
    const secondSlash = pathname.indexOf('/', pathname.indexOf('/', 1) + 1);
    repo = `${pathname.substring(1, secondSlash)}`;

    const treeEnd = pathname.indexOf('tree/') + 5;
    const slashAfterTree = pathname.indexOf('/', treeEnd);
    branch = pathname.substring(treeEnd, slashAfterTree);
  }

  if (pathname.includes('/blob/')) {
    const secondSlash = pathname.indexOf('/', pathname.indexOf('/', 1) + 1);
    repo = `${pathname.substring(1, secondSlash)}`;

    const treeEnd = pathname.indexOf('blob/') + 5;
    const slashAfterTree = pathname.indexOf('/', treeEnd);
    branch = pathname.substring(treeEnd, slashAfterTree);
  }

  url.pathname = `${repo}/${branch}/package.json`;
  return url;
}
