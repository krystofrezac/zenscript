import { AstNode } from '../ast/types';
import { checkAstNode } from './nodeCheckers';
import { AstCheckerContext, VariableScope } from './types';

export type CheckAstReturn = Pick<AstCheckerContext, 'errors'>;

export const checkAST = (
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
