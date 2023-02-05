import { CheckerContext } from '../checker/types';
import grammar from '../grammar.ohm-bundle';
import { createCheckTypeOperation } from '../operations/checkOperation';
import { createGetTypeOperation } from '../operations/getTypeOperation';
import { createGetTypesOperation } from '../operations/getTypesOperation';
import { createHasValueOperation } from '../operations/getHasValueOperation';
import { createTranspileOperation } from '../operations/transpileOperation';
import { createGetNameOperation } from '../operations/getNameOperation';

export const createSemantics = (checkerContext: CheckerContext) => {
  const semantics = grammar.createSemantics();
  createTranspileOperation(semantics);
  createGetTypeOperation(semantics, { checkerContext });
  createGetTypesOperation(semantics);
  createCheckTypeOperation(semantics, { checkerContext });
  createHasValueOperation(semantics, { checkerContext });
  createGetNameOperation(semantics);
  return semantics;
};
