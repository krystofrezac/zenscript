import { NonterminalNode } from 'ohm-js';
import { AstValueNode } from '../types';
import { isAstValueNode } from './isAstValueNode';

export const getTupleItemsTypes = (items: NonterminalNode) => {
  const itemsTypes = items.getAstNodes();
  if (itemsTypes.some(item => !isAstValueNode(item))) {
    return [];
  }
  // checked above
  const castedItemsTypes = itemsTypes as AstValueNode[];
  return castedItemsTypes;
};
