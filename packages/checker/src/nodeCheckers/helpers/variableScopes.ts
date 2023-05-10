import type { AstCheckerContext } from '../../types';

export const addVariableScope = (
  context: AstCheckerContext,
): AstCheckerContext => ({
  ...context,
  variableScopes: [...context.variableScopes, []],
});

export const removeVariableScope = (
  context: AstCheckerContext,
): AstCheckerContext => ({
  ...context,
  variableScopes: context.variableScopes.slice(0, -1),
});
