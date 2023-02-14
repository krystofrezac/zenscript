import { TypeNode, TypeTreeNode } from '../types';

export const isTypeNode = (node: TypeTreeNode): node is TypeNode =>
  ['block', 'string', 'number', 'tuple', 'variableReference'].includes(
    node.name,
  );
