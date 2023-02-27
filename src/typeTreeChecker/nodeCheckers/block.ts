import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import {
  CheckTypeTreeNode,
  CheckTypeTreeNodeReturn,
  TypeTreeCheckerContext,
} from '../types';
import { CheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import {
  addVariableScope,
  removeVariableScope,
} from './helpers/variableScopes';

export const checkBlockNode: CheckTypeTreeNode<TypeTreeNodeName.Block> = (
  context,
  block,
) => {
  const contextWithAddedVariableScope: TypeTreeCheckerContext =
    addVariableScope(context);

  const contextAfterChildren = block.children.reduce<CheckTypeTreeNodeReturn>(
    (previousContext, child) => checkTypeTreeNode(previousContext, child),
    getCheckNodeReturn(contextWithAddedVariableScope, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    }),
  );

  const contextWithRemovedVariableScope: TypeTreeCheckerContext =
    removeVariableScope(contextAfterChildren);

  return getCheckNodeReturn(
    contextWithRemovedVariableScope,
    contextAfterChildren.nodeType,
  );
};
