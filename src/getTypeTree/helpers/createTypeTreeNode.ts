import { TypeTreeNode, TypeTreeNodeName } from '../types';

export const createTypeTreeNode = <T extends TypeTreeNode>(node: T): T => node;

export const createInvalidTreeNode = () =>
  createTypeTreeNode({ name: TypeTreeNodeName.Invalid });
