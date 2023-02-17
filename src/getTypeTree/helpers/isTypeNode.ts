import { TypeNode, TypeTreeNode } from '../types';

export const isTypeNode = (node: TypeTreeNode): node is TypeNode =>
  [
    'block',
    'string',
    'number',
    'tuple',
    'variableReference',
    'function',
    'parameter',
    'generic',
  ].includes(node.name);
