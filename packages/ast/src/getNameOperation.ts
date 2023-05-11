import type ohm from 'ohm-js';
import type { BoringLangSemantics } from './grammar.ohm-bundle';

export const createGetNameOperation = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['getName']>>('getName', {
    identifier: name => name.sourceString,
  });
