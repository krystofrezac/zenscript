import { MatchResult } from 'ohm-js';
import grammar from '../grammar.ohm-bundle';
import { getAstNodeOperation } from './getAstNodeOperation';
import { createGetNameOperation } from './getNameOperation';
import { AstNode } from './types';
import { getAstNodesOperations } from './getAstNodesOperation';

export const getAst = (parsedInput: MatchResult): AstNode => {
  const semantics = grammar.createSemantics();
  getAstNodeOperation(semantics);
  getAstNodesOperations(semantics);
  createGetNameOperation(semantics);

  const adapter = semantics(parsedInput);

  return adapter.getAstNode();
};
