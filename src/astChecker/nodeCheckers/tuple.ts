import { checkAstNode } from '.';
import { AstNodeName } from '../../typeAST/types';
import { CheckAstNode, CheckAstNodeReturn } from '../types';
import { AstCheckerTupleType, AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkTupleNode: CheckAstNode<AstNodeName.Tuple> = (
  context,
  tuple,
) => {
  const contextAfterItems = tuple.items.reduce<
    CheckAstNodeReturn<AstCheckerTupleType>
  >(
    (prevContext, item) => {
      const itemContext = checkAstNode(prevContext, item);
      const newTuple: AstCheckerTupleType = {
        ...prevContext.nodeType,
        items: [...prevContext.nodeType.items, itemContext.nodeType],
      };
      return getCheckNodeReturn(itemContext, newTuple);
    },
    getCheckNodeReturn(context, {
      name: AstCheckerTypeNames.Tuple,
      items: [],
      hasValue: tuple.hasValue,
    }),
  );

  return contextAfterItems;
};
