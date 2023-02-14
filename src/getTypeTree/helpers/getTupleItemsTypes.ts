import { NonterminalNode } from 'ohm-js';
import { TypeNode } from '../types';
import { createInvalidTreeNode } from './createTypeTreeNode';
import { isTypeNode } from './isTypeNode';

export const getTupleItemsTypes = (items: NonterminalNode) => {
  const itemsTypes = items.getTypeTreeNodes();
  if (itemsTypes.some(item => !isTypeNode(item))) {
    return [];
  }
  // checked above
  const castedItemsTypes = itemsTypes as TypeNode[];
  return castedItemsTypes;
};
