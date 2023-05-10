import type { AstNode } from '@zen-script/ast';
import { checkAstNode } from './nodeCheckers';
import type { AstCheckerContext, VariableScope } from './types';

export type CheckAstReturn = Pick<AstCheckerContext, 'errors'>;

export const checkAst = (
  ast: AstNode,
  defaultVariables?: VariableScope,
): CheckAstReturn => {
  const variableScopes = defaultVariables ? [defaultVariables] : [];
  const defaultContext: AstCheckerContext = {
    errors: [],
    variableScopes,
    figureOutId: 0,
  };

  const result = checkAstNode(defaultContext, ast);
  return {
    errors: result.errors,
  };
};
