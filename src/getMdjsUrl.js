export function getMdjsUrl(urlString) {
  const url = new URL(urlString);
  if (url.host === 'raw.githubusercontent.com') {
    return url;
  }

  url.host = 'raw.githubusercontent.com';
  const { pathname } = url;

  let branch = 'master';
  let repo = pathname.substring(1);
  let relativePath = '';
  if (pathname.includes('/tree/')) {
    const secondSlash = pathname.indexOf('/', pathname.indexOf('/', 1) + 1);
    repo = `${pathname.substring(1, secondSlash)}`;

    const treeEnd = pathname.indexOf('tree/') + 5;
    const slashAfterTree = pathname.indexOf('/', treeEnd);
    branch = pathname.substring(treeEnd, slashAfterTree);

    relativePath = pathname.substring(slashAfterTree + 1);
  }

  if (pathname.includes('/blob/')) {
    const secondSlash = pathname.indexOf('/', pathname.indexOf('/', 1) + 1);
    repo = `${pathname.substring(1, secondSlash)}`;

    const treeEnd = pathname.indexOf('blob/') + 5;
    const slashAfterTree = pathname.indexOf('/', treeEnd);
    branch = pathname.substring(treeEnd, slashAfterTree);

    relativePath = pathname.substring(slashAfterTree + 1);
  }

  let finalPath = '';
  if (relativePath === '') {
    finalPath = `README.md`;
  } else if (relativePath.endsWith('.md')) {
    finalPath = relativePath;
  } else if (!relativePath.includes('.')) {
    finalPath = `${relativePath}/README.md`;
  }

  url.pathname = `${repo}/${branch}/${finalPath}`;

  return url;
}
