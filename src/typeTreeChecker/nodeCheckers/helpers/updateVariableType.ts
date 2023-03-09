import { TypeTreeCheckerContext } from '../../types';
import { CheckerType } from '../../types/types';

type UpdateVariableTypeParams = {
  variableName: string;
  updatedType: CheckerType;
};

export const updateVariableType = (
  context: TypeTreeCheckerContext,
  { variableName, updatedType }: UpdateVariableTypeParams,
): TypeTreeCheckerContext => {
  let updated = false;

  const newVariableScopes = context.variableScopes
    .slice()
    .reverse()
    .map(variableScope =>
      variableScope.map(variable => {
        if (updated || variable.variableName !== variableName) return variable;

        updated = true;
        return { variableName, variableType: updatedType };
      }),
    )
    .reverse();
  return { ...context, variableScopes: newVariableScopes };
};
