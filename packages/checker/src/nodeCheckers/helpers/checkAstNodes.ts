import type { AstNode } from '@zen-script/ast';
import { checkAstNode } from '..';
import type { AstCheckerContext, CheckAstNodeReturn } from '../../types';
import type { AstCheckerType } from '../../types/types';

export const checkAstNodes = <TNode extends AstNode = AstNode>(
  context: AstCheckerContext,
  nodes: TNode[],
  checker: (
    context: AstCheckerContext,
    node: TNode,
  ) => CheckAstNodeReturn = checkAstNode,
) =>
  nodes.reduce<{
    context: AstCheckerContext;
    nodeTypes: AstCheckerType[];
  }>(
    (acc, current) => {
      const checkedParameter = checker(acc.context, current);
      return {
        context: checkedParameter,
        nodeTypes: [...acc.nodeTypes, checkedParameter.nodeType],
      };
    },
    { context, nodeTypes: [] },
  );
