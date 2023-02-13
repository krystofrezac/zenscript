import ohm from 'ohm-js';
import { BoringLangSemantics } from '../grammar.ohm-bundle';

export const createGetTypeTreeNodesOperation = (
  semantics: BoringLangSemantics,
) =>
  semantics.addOperation<ReturnType<ohm.Node['getTypeTreeNodes']>>(
    'getTypeTreeNodes',
    {
      _iter: (...children) => children.map(ch => ch.getTypeTreeNode()),
    },
  );
