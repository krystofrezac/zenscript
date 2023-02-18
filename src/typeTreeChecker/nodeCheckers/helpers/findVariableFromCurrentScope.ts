import { TypeTreeCheckerContext } from '../../types';

export const findVariableFromCurrentScope = (
  context: TypeTreeCheckerContext,
  variableName: string,
) =>
  context.variableScopes
    .reverse()
    .flat()
    .find(variable => variable.variableName === variableName);
