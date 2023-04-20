import { AstCheckerContext } from '../../types';
import { AstCheckerType, AstCheckerTypeNames } from '../../types/types';

type UpdateFigureOutTypeParams = {
  figureOutId: number;
  updatedType: AstCheckerType;
};

export const updateFigureOutType = (
  context: AstCheckerContext,
  { figureOutId, updatedType }: UpdateFigureOutTypeParams,
): AstCheckerContext => {
  const newVariableScopes = context.variableScopes.map(variableScope =>
    variableScope.map(variable => {
      if (
        variable.variableType.name !== AstCheckerTypeNames.FigureOut ||
        variable.variableType.id !== figureOutId
      )
        return variable;

      return { ...variable, variableType: updatedType };
    }),
  );
  return { ...context, variableScopes: newVariableScopes };
};
