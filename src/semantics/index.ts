import grammar from '../grammar.ohm-bundle';
import { createGetTypeTreeNodeOperation } from '../getTypeTree/getTypeTreeNodeOperation';
import { createGetTypeTreeNodesOperation } from '../getTypeTree/getTypeTreeNodesOperation';
import { createGetNameOperation } from './operations/getNameOperation';

export const createSemantics = () => {
  const semantics = grammar.createSemantics();
  createGetTypeTreeNodeOperation(semantics);
  createGetTypeTreeNodesOperation(semantics);
  // createTranspileOperation(semantics);

  // createGetTypeOperation(semantics, { checkerContext });
  // createGetTypesOperation(semantics);
  // createCheckTypeOperation(semantics, { checkerContext });
  // createHasValueOperation(semantics, { checkerContext });
  createGetNameOperation(semantics);
  return semantics;
};
