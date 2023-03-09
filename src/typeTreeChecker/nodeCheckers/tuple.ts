import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode, CheckTypeTreeNodeReturn } from '../types';
import { CheckerTupleType, CheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkTupleNode: CheckTypeTreeNode<TypeTreeNodeName.Tuple> = (
  context,
  tuple,
) => {
  const contextAfterItems = tuple.items.reduce<
    CheckTypeTreeNodeReturn<CheckerTupleType>
  >(
    (prevContext, item) => {
      const itemContext = checkTypeTreeNode(prevContext, item);
      const newTuple: CheckerTupleType = {
        ...prevContext.nodeType,
        items: [...prevContext.nodeType.items, itemContext.nodeType],
      };
      return getCheckNodeReturn(itemContext, newTuple);
    },
    getCheckNodeReturn(context, {
      name: CheckerTypeNames.Tuple,
      items: [],
      hasValue: tuple.hasValue,
    }),
  );

  return contextAfterItems;
};
