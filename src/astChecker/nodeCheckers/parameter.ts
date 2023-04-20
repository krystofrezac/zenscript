import { AstNodeName } from '../../ast/types';
import { CheckAstNode, AstCheckerContext } from '../types';
import { AstCheckerType, AstCheckerTypeNames } from '../types/types';
import { addVariableToContext } from './helpers/addVariableToContext';
import { checkIfVariableWithNameIsAlreadyDeclared } from './helpers/checkIfVariableWithNameIsAlreadyDeclared';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkParameter: CheckAstNode<AstNodeName.Parameter> = (
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
  const variableType: AstCheckerType = {
    name: AstCheckerTypeNames.FigureOut,
    id: figureOutId,
    hasValue: true,
  };
  const contextWithBumpedFigureOutId: AstCheckerContext = {
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
