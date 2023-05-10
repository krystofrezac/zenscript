import type { AstNodeName } from '@zen-script/ast';
import { checkAstNode } from '.';
import type {
  CheckAstNode,
  CheckAstNodeReturn,
  AstCheckerContext,
} from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import {
  addVariableScope,
  removeVariableScope,
} from './helpers/variableScopes';

export const checkBlockNode: CheckAstNode<AstNodeName.Block> = (
  context,
  block,
) => {
  const contextWithAddedVariableScope: AstCheckerContext =
    addVariableScope(context);

  if (block.children.length === 0) {
    return getCheckNodeReturn(
      addError(context, {
        name: AstCheckerErrorName.EmptyBlock,
        data: {},
      }),
      { name: AstCheckerTypeNames.Empty, hasValue: false },
    );
  }

  const contextAfterChildren = block.children.reduce<CheckAstNodeReturn>(
    (previousContext, child) => checkAstNode(previousContext, child),
    getCheckNodeReturn(contextWithAddedVariableScope, {
      name: AstCheckerTypeNames.Empty,
      hasValue: false,
    }),
  );

  const contextWithRemovedVariableScope: AstCheckerContext =
    removeVariableScope(contextAfterChildren);

  return getCheckNodeReturn(
    contextWithRemovedVariableScope,
    contextAfterChildren.nodeType,
  );
};
