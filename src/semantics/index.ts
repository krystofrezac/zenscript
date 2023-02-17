import grammar from '../grammar.ohm-bundle';
import { createGetTypeTreeNodeOperation } from '../getTypeTree/getTypeTreeNodeOperation';
import { createGetTypeTreeNodesOperation } from '../getTypeTree/getTypeTreeNodesOperation';
import { createGetNameOperation } from './operations/getNameOperation';

export const createSemantics = () => {
  const semantics = grammar.createSemantics();
  createGetTypeTreeNodeOperation(semantics);
  createGetTypeTreeNodesOperation(semantics);

  createGetNameOperation(semantics);
  return semantics;
};
