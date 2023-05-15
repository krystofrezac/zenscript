import type { AstNode } from '@zen-script/ast';
import { checkAstNode } from './nodeCheckers';
import type { AstCheckerContext, VariableScope } from './types';

export type CheckAstResult = Pick<
  AstCheckerContext,
  'errors' | 'exportedVariables'
>;

export type CheckAstParams = {
  ast: AstNode;
  getAstCheckCachedResult: (fileName: string) => CheckAstResult | undefined;
  saveAstCheckResultToCache: (fileName: string, result: CheckAstResult) => void;
  getFileAst: (fileName: string) => AstNode | undefined;
  defaultVariables?: VariableScope;
};

export const checkAstInternal = ({
  ast,
  defaultVariables,
}: CheckAstParams): CheckAstResult => {
  const variableScopes = defaultVariables ? [defaultVariables] : [];
  const defaultContext: AstCheckerContext = {
    errors: [],
    exportedVariables: [],
    variableScopes,
    figureOutId: 0,
  };

  const { errors, exportedVariables } = checkAstNode(defaultContext, ast);
  return {
    errors,
    exportedVariables,
  };
};

export const checkAst = (params: Omit<CheckAstParams, 'defaultContext'>) =>
  checkAstInternal(params);
