import grammar from './grammar.ohm-bundle';
import { getAstNodeOperation } from './getAstNodeOperation';
import { createGetNameOperation } from './getNameOperation';
import { AstNode } from './types';
import { getAstNodesOperations } from './getAstNodesOperation';
import { parse } from './parser';

export const getAst = (code: string): AstNode => {
  const parsed = parse(code);

  const semantics = grammar.createSemantics();
  getAstNodeOperation(semantics);
  getAstNodesOperations(semantics);
  createGetNameOperation(semantics);

  const adapter = semantics(parsed);

  return adapter.getAstNode();
};
