import { TypeTreeCheckerContext, Variable } from '../../types';

export const addVariableToContext = (
  context: TypeTreeCheckerContext,
  variable: Variable,
): TypeTreeCheckerContext => {
  const variableScopesHead = context.variableScopes.slice(0, -1);
  const variableScopesTail = context.variableScopes.at(-1);
  if (!variableScopesTail) return context;
  return {
    ...context,
    variableScopes: [...variableScopesHead, [...variableScopesTail, variable]],
  };
};
