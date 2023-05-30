export const getFilePath = (currentPath: string, filePath: string) => {
  const currentDir = currentPath.replace(/.*\.zs/, '');

  const joinedPath = `${currentDir}/${filePath}.zs`
    .replaceAll('//', '/')
    .replaceAll('/./', '/')
    .replace(/^(\.?\/)/, '');

  return joinedPath;
};
