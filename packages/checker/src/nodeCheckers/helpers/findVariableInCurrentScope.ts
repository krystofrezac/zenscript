import { AstCheckerContext } from '../../types';

export const findVariableInCurrentScope = (
  context: AstCheckerContext,
  variableName: string,
) => {
  const currentScope = context.variableScopes.at(-1);
  return currentScope?.find(variable => variable.variableName === variableName);
};
