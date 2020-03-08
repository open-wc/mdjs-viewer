export function evalModuleCode(codeIn, force = false) {
  const code = force ? `${codeIn}//${Math.random()}` : codeIn;
  return import(`data:text/javascript;base64,${btoa(code)}`);
}
