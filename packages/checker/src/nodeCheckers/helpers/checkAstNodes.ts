import type { AstNode } from '@zen-script/ast';
import type { AstCheckerContext, CheckAstNodeReturn } from '../../types';
import type { AstCheckerType } from '../../types/types';

export const checkAstNodes = <
  TNode extends AstNode = AstNode,
  TResultNode extends AstCheckerType = AstCheckerType,
>(
  context: AstCheckerContext,
  nodes: TNode[],
  checker: (
    context: AstCheckerContext,
    node: TNode,
  ) => CheckAstNodeReturn<TResultNode>,
) =>
  nodes.reduce<{
    context: AstCheckerContext;
    nodeTypes: TResultNode[];
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
