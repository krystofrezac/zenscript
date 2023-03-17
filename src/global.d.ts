import { AstNode } from './ast/types';

declare module 'ohm-js' {
  interface Node {
    getName: () => string;
    getAstNode: () => AstNode;
    getAstNodes: () => AstNode[];
    transpile: () => string;
  }
}
