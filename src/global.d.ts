import { AstNode } from './typeAST/types';

declare module 'ohm-js' {
  interface Node {
    getName: () => string;
    getAstNode: () => AstNode;
    getAstNodes: () => AstNode[];
  }
}
