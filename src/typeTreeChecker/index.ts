import { TypeTreeNode } from '../getTypeTree/types';
import { checkTypeTreeNode } from './nodeCheckers';
import { TypeTreeCheckerContext, VariableScope } from './types';

export type CheckTypeTreeReturn = Pick<TypeTreeCheckerContext, 'errors'>;

export const checkTypeTree = (
  typeTree: TypeTreeNode,
  defaultVariables?: VariableScope,
): CheckTypeTreeReturn => {
  const variableScopes = defaultVariables ? [defaultVariables] : [];
  const defaultContext: TypeTreeCheckerContext = {
    errors: [],
    variableScopes,
    functionIdCounter: 0,
  };

  const result = checkTypeTreeNode(defaultContext, typeTree);
  return {
    errors: result.errors,
  };
};
