import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import {
  CheckTypeTreeNode,
  CheckTypeTreeNodeReturn,
  TypeTreeCheckerContext,
} from '../types';
import { CheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkBlockNode: CheckTypeTreeNode<TypeTreeNodeName.Block> = (
  context,
  block,
) => {
  const contextWithAddedVariableScope: TypeTreeCheckerContext = {
    ...context,
    variableScopes: [...context.variableScopes, []],
  };
  const contextAfterChildren = block.children.reduce<CheckTypeTreeNodeReturn>(
    (previousContext, child) => checkTypeTreeNode(previousContext, child),
    getCheckNodeReturn(contextWithAddedVariableScope, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    }),
  );
  const contextWithRemovedVariableScope: TypeTreeCheckerContext = {
    ...contextAfterChildren,
    variableScopes: context.variableScopes.slice(0, -1),
  };
  return getCheckNodeReturn(
    contextWithRemovedVariableScope,
    contextAfterChildren.nodeType,
  );
};
