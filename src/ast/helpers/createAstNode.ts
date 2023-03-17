import { AstNode, AstNodeName } from '../types';

export const createAstNode = <T extends AstNode>(node: T): T => node;

export const createInvalidAstNode = () =>
  createAstNode({ name: AstNodeName.Invalid });
