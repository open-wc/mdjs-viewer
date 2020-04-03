import { parse } from '../deps/lexer.js';

/**
 * @param {string} code
 * @param {string} replacement
 * @param {number} start
 * @param {number} end
 * @return {string} String with replaced content
 */
function replaceCode(code = '', replacement, start, end) {
  const before = code.substring(0, start);
  const after = code.substring(end);
  return `${before}${replacement}${after}`;
}

/**
 *
 * @param {string} pkgImport
 * @param {string} fallbackName
 * @param {object} urlData
 */
function getPkgMetaFromImport(
  pkgImport,
  fallbackName = '',
  urlData = { fileUrl: '', rootUrl: '' },
) {
  if (pkgImport.startsWith('./') || pkgImport.startsWith('../')) {
    const resolvedUrl = new URL(pkgImport, urlData.fileUrl).href;
    const path = resolvedUrl.substr(urlData.rootUrl.length);

    return {
      name: fallbackName,
      path,
    };
  }

  let scope = '';
  let name = '';
  let path = '';
  if (pkgImport.startsWith('@')) {
    const parts = pkgImport.split('/');
    scope = parts.shift();
    name = parts.shift();
    if (parts.length > 0) {
      path = `/${parts.join('/')}`;
    }
    name = `${scope}/${name}`;
  } else {
    const parts = pkgImport.split('/');
    name = parts.shift();
    if (parts.length > 0) {
      path = `/${parts.join('/')}`;
    }
  }
  return { name, path };
}

/**
 *
 * @param {string} code
 * @param {object} pkgJson
 * @param {object} urlData
 */
export async function resolveToUnpkg(code, pkgJson = {}, urlData = { fileUrl: '', rootUrl: '' }) {
  const [imports] = await parse(code);

  const versions = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };
  if (pkgJson.name && pkgJson.version) {
    versions[pkgJson.name] = pkgJson.version;
  }

  let result = code;
  for (const importMeta of imports.reverse()) {
    const importPath = code.substring(importMeta.s, importMeta.e);
    if (!importPath.startsWith('http')) {
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        if (!(urlData.fileUrl && urlData.rootUrl)) {
          const errorMsg = [
            `Relative URLs require providing urlData with { fileUrl, rootUrl } as a 3rd parameter`,
            `Example: "resolveToUnpkg(code, pkgJson, { fileUrl: 'http://...', rootUrl: 'http://...' })`,
            `Provided: "${JSON.stringify(urlData)}"`,
          ];
          throw new Error(errorMsg.join('\n'));
        }
      }

      const pkgMeta = getPkgMetaFromImport(importPath, pkgJson.name, urlData);
      const version = versions[pkgMeta.name];
      let newImport = `https://unpkg.com/${pkgMeta.name}${pkgMeta.path}?module`;
      if (version) {
        newImport = `https://unpkg.com/${pkgMeta.name}@${version}${pkgMeta.path}?module`;
      }
      result = replaceCode(result, newImport, importMeta.s, importMeta.e);
    }
  }

  return result;
}
