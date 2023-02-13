import { TypeTreeNode } from '../types';

export const createTypeTreeNode = (node: TypeTreeNode) => node;

export const createInvalidTreeNode = () =>
  createTypeTreeNode({ name: 'invalid' });
