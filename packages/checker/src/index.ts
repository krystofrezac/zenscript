import type { AstNode } from '@zen-script/ast';
import { checkAstNode } from './nodeCheckers';
import type { AstCheckerContext, VariableScope } from './types';
import { getFilePath } from './helpers/getFilePath';

export type CheckAstResult = Pick<
  AstCheckerContext,
  'errors' | 'exportedVariables'
>;

export type CheckAstParams = {
  ast: AstNode;
  filePath: string;
  getAstCheckCachedResult: (fileName: string) => CheckAstResult | undefined;
  saveAstCheckResultToCache: (fileName: string, result: CheckAstResult) => void;
  getFileAst: (fileName: string) => AstNode | undefined;
  defaultVariables?: VariableScope;
};

export const checkAst = ({
  ast,
  filePath,
  defaultVariables,
  getAstCheckCachedResult,
  saveAstCheckResultToCache,
  getFileAst,
}: CheckAstParams): CheckAstResult => {
  const variableScopes = defaultVariables ? [defaultVariables] : [];
  const defaultContext: AstCheckerContext = {
    errors: [],
    exportedVariables: [],
    variableScopes,
    figureOutId: 0,
    filePath,
    importFile: (currentFilePath, requestedFilePath) => {
      const filePath = getFilePath(currentFilePath, requestedFilePath);

      const cachedResult = getAstCheckCachedResult(filePath);
      if (cachedResult) return cachedResult;

      const newAst = getFileAst(filePath);
      if (!newAst) return undefined;

      const checkedAst = checkAst({
        ast: newAst,
        filePath,
        defaultVariables,
        getAstCheckCachedResult,
        saveAstCheckResultToCache,
        getFileAst,
      });
      saveAstCheckResultToCache(filePath, checkedAst);
      return checkedAst;
    },
  };

  const { errors, exportedVariables } = checkAstNode(defaultContext, ast);
  return {
    errors,
    exportedVariables,
  };
};
