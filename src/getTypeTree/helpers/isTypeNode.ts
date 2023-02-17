import { TypeNode, TypeTreeNode } from '../types';

export const isTypeNode = (node: TypeTreeNode): node is TypeNode =>
  [
    'block',
    'string',
    'number',
    'tuple',
    'variableReference',
    'functionDeclaration',
    'functionCall',
    'parameter',
    'generic',
  ].includes(node.name);
