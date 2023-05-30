import { getAst } from '@zen-script/ast';
import type { CheckAstParams, CheckAstResult } from '..';
import { checkAstInternal } from '..';

type CheckAstInTestParams = Pick<CheckAstParams, 'defaultVariables'> & {
  entryFile: string;
  entryPathFile?: string;
  files?: Record<string, string>;
};

export const testCheckAst = ({
  entryFile,
  entryPathFile,
  files = {},
  defaultVariables,
}: CheckAstInTestParams) => {
  const checkAstResults: Record<string, CheckAstResult> = {};

  const params: CheckAstParams = {
    ast: getAst(entryFile),
    filePath: entryPathFile ?? '',
    getFileAst: fileName => {
      const fileSource = files[fileName];
      if (fileSource === undefined) return;
      return getAst(fileSource);
    },
    saveAstCheckResultToCache: (fileName, ast) =>
      (checkAstResults[fileName] = ast),
    getAstCheckCachedResult: fileName => checkAstResults[fileName],
    defaultVariables,
  };
  return checkAstInternal(params);
};
