/* eslint-disable no-await-in-loop */
import { getMdjsUrl } from './getMdjsUrl.js';
import { getFromBackground as defaultGetFromBackground } from './getFromBackground.js';

function getDirUrl(url) {
  return url.substring(0, url.lastIndexOf('/'));
}

function isValidUrl(url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
  } catch (error) {
    return false;
  }
  return true;
}

export async function getGithubMdjs(url, { getFromBackground = defaultGetFromBackground } = {}) {
  const mdjsUrl = getMdjsUrl(url).href;

  let i = 0;
  let currentUrl = mdjsUrl;
  do {
    currentUrl = getDirUrl(currentUrl);
    if (isValidUrl(currentUrl)) {
      const pkgJsonUrl = `${currentUrl}/package.json`;
      const responsePksJsonFile = await getFromBackground({
        action: 'fetch',
        fetchProcess: 'json',
        url: pkgJsonUrl,
      });

      if (responsePksJsonFile.ok) {
        const pkgUrl = getDirUrl(pkgJsonUrl);

        const responseMdjsFile = await getFromBackground({
          action: 'fetch',
          fetchProcess: 'text',
          url: mdjsUrl,
        });

        if (responseMdjsFile.ok) {
          return {
            ok: true,
            mdjsUrl,
            mdjs: responseMdjsFile.data,
            pkgUrl,
            pkgJsonUrl,
            pkgJson: responsePksJsonFile.data,
          };
        }
      }
    }

    i += 1;
  } while (i < 5); // search up to 5 dirs for a package.json

  return {
    ok: false,
  };
}
