export function getGithubUrlData(urlString) {
  const toBranch = urlString
    .split('/')
    .splice(0, 6)
    .join('/');
  return {
    fileUrl: urlString,
    rootUrl: `${toBranch}/`,
  };
}
