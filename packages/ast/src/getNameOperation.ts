import type ohm from 'ohm-js';
import type { BoringLangSemantics } from './grammar.ohm-bundle';

export const createGetNameOperation = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['getName']>>('getName', {
    identifier: (smallLetter, rest) =>
      `${smallLetter.sourceString}${rest.sourceString}`,
    stringExpression: (_startQuote, content, _endQuote) => content.sourceString,
    atomIdentifier: (firstLetter, rest) =>
      `${firstLetter.sourceString}${rest.sourceString}`,
  });
