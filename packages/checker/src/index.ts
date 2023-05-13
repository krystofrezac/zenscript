import type { AstNode } from '@zen-script/ast';
import { checkAstNode } from './nodeCheckers';
import type { AstCheckerContext, VariableScope } from './types';

export type CheckAstReturn = Pick<
  AstCheckerContext,
  'errors' | 'exportedVariables'
>;

export const checkAst = (
  ast: AstNode,
  defaultVariables?: VariableScope,
): CheckAstReturn => {
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
