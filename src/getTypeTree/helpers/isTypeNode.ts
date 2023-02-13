import { TypeNode, TypeTreeNode } from '../types';

export const isTypeNode = (node: TypeTreeNode): node is TypeNode =>
  ['block', 'string', 'number'].includes(node.name);
