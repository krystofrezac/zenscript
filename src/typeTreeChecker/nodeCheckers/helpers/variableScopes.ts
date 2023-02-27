import { TypeTreeCheckerContext } from '../../types';

export const addVariableScope = (
  context: TypeTreeCheckerContext,
): TypeTreeCheckerContext => ({
  ...context,
  variableScopes: [...context.variableScopes, []],
});

export const removeVariableScope = (
  context: TypeTreeCheckerContext,
): TypeTreeCheckerContext => ({
  ...context,
  variableScopes: context.variableScopes.slice(0, -1),
});
