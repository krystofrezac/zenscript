import { TypeTreeNode } from './getTypeTree/types';

declare module 'ohm-js' {
  interface Node {
    getName: () => string;
    getTypeTreeNode: () => TypeTreeNode;
    getTypeTreeNodes: () => TypeTreeNode[];
    transpile: () => string;
  }
}
