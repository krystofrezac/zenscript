import { Type } from './checker/types';
import { TypeTreeNode } from './getTypeTree/types';

declare module 'ohm-js' {
  interface Node {
    getType: () => Type;
    getTypes: () => Type[];
    checkType: () => void;
    getHasValue: () => boolean;
    getName: () => string;

    getTypeTreeNode: () => TypeTreeNode;
    getTypeTreeNodes: () => TypeTreeNode[];
    transpile: () => string;
  }
}
