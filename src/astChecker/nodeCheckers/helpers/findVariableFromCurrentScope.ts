import { AstCheckerContext } from '../../types';

export const findVariableFromCurrentScope = (
  context: AstCheckerContext,
  variableName: string,
) =>
  context.variableScopes
    .reverse()
    .flat()
    .find(variable => variable.variableName === variableName);
