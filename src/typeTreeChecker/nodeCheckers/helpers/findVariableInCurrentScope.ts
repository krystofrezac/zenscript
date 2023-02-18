import { TypeTreeCheckerContext } from '../../types';

export const findVariableInCurrentScope = (
  context: TypeTreeCheckerContext,
  variableName: string,
) => {
  const currentScope = context.variableScopes.at(-1);
  return currentScope?.find(variable => variable.variableName === variableName);
};
