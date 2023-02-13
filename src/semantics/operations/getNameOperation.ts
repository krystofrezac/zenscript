import ohm from 'ohm-js';
import { BoringLangSemantics } from '../../grammar.ohm-bundle';

export const createGetNameOperation = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['getName']>>('getName', {
    identifier: name => name.sourceString,
    genericName: (_apostrophe, name) => name.sourceString,
  });
