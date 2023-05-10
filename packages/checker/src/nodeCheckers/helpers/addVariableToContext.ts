import type { AstCheckerContext, Variable } from '../../types';

export const addVariableToContext = (
  context: AstCheckerContext,
  variable: Variable,
): AstCheckerContext => {
  const variableScopesHead = context.variableScopes.slice(0, -1);
  const variableScopesTail = context.variableScopes.at(-1);
  if (!variableScopesTail) return context;
  return {
    ...context,
    variableScopes: [...variableScopesHead, [...variableScopesTail, variable]],
  };
};
