import { TypeTreeNode } from '../getTypeTree/types';
import { checkTypeTreeNode } from './nodeCheckers';
import { TypeTreeCheckerContext } from './types';

export type CheckTypeTreeReturn = Pick<TypeTreeCheckerContext, 'errors'>;

const defaultContext: TypeTreeCheckerContext = {
  errors: [],
  variableScopes: [],
};

export const checkTypeTree = (typeTree: TypeTreeNode): CheckTypeTreeReturn => {
  const result = checkTypeTreeNode(defaultContext, typeTree);
  return {
    errors: result.errors,
  };
};
