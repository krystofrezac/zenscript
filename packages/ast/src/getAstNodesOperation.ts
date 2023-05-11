import type ohm from 'ohm-js';
import type { BoringLangSemantics } from './grammar.ohm-bundle';

export const getAstNodesOperations = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['getAstNodes']>>('getAstNodes', {
    _iter: (...children) => children.map(ch => ch.getAstNode()),
    NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) => [
      firstItem.getAstNode(),
      ...tailIterable.getAstNodes(),
    ],
    EmptyListOf: () => [],
    Min2List: (first, _separator, tail) => [
      first.getAstNode(),
      ...tail.getAstNodes(),
    ],
  });
