import { AstNodeName, AstNode } from '@sphere-script/ast';
import { checkAstNode } from '.';
import { AstCheckerContext, CheckAstNode, CheckAstNodeReturn } from '../types';
import { AstCheckerTupleType, AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkTupleNode =
  (
    hasValue: boolean,
  ): CheckAstNode<AstNodeName.TupleExpression | AstNodeName.TupleType> =>
  (context, tuple) => {
    const contextAfterItems = reduceResult(context, hasValue, tuple.items);
    return contextAfterItems;
  };

// TS hack, because you cannot reduce tuple.items directly
const reduceResult = (
  context: AstCheckerContext,
  hasValue: boolean,
  arr: AstNode[],
) =>
  arr.reduce<CheckAstNodeReturn<AstCheckerTupleType>>(
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
      hasValue,
    }),
  );
