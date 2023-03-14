import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode, TypeTreeCheckerContext } from '../types';
import { CheckerType, CheckerTypeNames } from '../types/types';
import { addVariableToContext } from './helpers/addVariableToContext';
import { checkIfVariableWithNameIsAlreadyDeclared } from './helpers/checkIfVariableWithNameIsAreadyDeclared';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkParameter: CheckTypeTreeNode<TypeTreeNodeName.Parameter> = (
  context,
  parameter,
) => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    parameter.parameterName,
  );
  if (alreadyDeclaredError) {
    return alreadyDeclaredError;
  }

  const figureOutId = context.figureOutId + 1;
  const variableType: CheckerType = {
    name: CheckerTypeNames.FigureOut,
    id: figureOutId,
    hasValue: true,
  };
  const contextWithBumpedFigureOutId: TypeTreeCheckerContext = {
    ...context,
    figureOutId,
  };

  const contextWithVariable = addVariableToContext(
    contextWithBumpedFigureOutId,
    {
      variableName: parameter.parameterName,
      variableType,
    },
  );
  return getCheckNodeReturn(contextWithVariable, variableType);
};
