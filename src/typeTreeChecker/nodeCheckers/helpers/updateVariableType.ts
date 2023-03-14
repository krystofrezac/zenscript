import { TypeTreeCheckerContext } from '../../types';
import { CheckerType, CheckerTypeNames } from '../../types/types';

type UpdateFigureOutTypeParams = {
  figureOutId: number;
  updatedType: CheckerType;
};

export const updateFigureOutType = (
  context: TypeTreeCheckerContext,
  { figureOutId, updatedType }: UpdateFigureOutTypeParams,
): TypeTreeCheckerContext => {
  const newVariableScopes = context.variableScopes.map(variableScope =>
    variableScope.map(variable => {
      if (
        variable.variableType.name !== CheckerTypeNames.FigureOut ||
        variable.variableType.id !== figureOutId
      )
        return variable;

      return { ...variable, variableType: updatedType };
    }),
  );
  return { ...context, variableScopes: newVariableScopes };
};
