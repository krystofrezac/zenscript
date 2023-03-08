import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import {
  CheckTypeTreeNode,
  CheckTypeTreeNodeReturn,
  TypeTreeCheckerContext,
} from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
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

  if (block.children.length === 0) {
    return getCheckNodeReturn(
      addError(context, {
        name: TypeTreeCheckerErrorName.EmptyBlock,
        data: {},
      }),
      { name: CheckerTypeNames.Empty, hasValue: false },
    );
  }

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
