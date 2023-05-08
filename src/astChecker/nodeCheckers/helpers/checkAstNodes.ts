import { checkAstNode } from '..';
import { AstNode } from '../../../ast/types';
import { AstCheckerContext } from '../../types';
import { AstCheckerType } from '../../types/types';

export const checkAstNodes = (context: AstCheckerContext, nodes: AstNode[]) =>
  nodes.reduce<{
    context: AstCheckerContext;
    nodeTypes: AstCheckerType[];
  }>(
    (acc, current) => {
      const checkedParameter = checkAstNode(acc.context, current);
      return {
        context: checkedParameter,
        nodeTypes: [...acc.nodeTypes, checkedParameter.nodeType],
      };
    },
    { context, nodeTypes: [] },
  );
