import { IdentifierExpressionAstNode } from '../../../../ast/types/expressionNodes';
import { AstCheckerContext } from '../../../types';
import { AstCheckerType, AstCheckerTypeNames } from '../../../types/types';
import { addVariableToContext } from '../../helpers/addVariableToContext';
import { checkIfVariableWithNameIsAlreadyDeclared } from '../../helpers/checkIfVariableWithNameIsAlreadyDeclared';
import { getCheckNodeReturn } from '../../helpers/getCheckNodeReturn';

const checkParameter = (
  context: AstCheckerContext,
  parameter: IdentifierExpressionAstNode,
) => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    parameter.identifierName,
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
      variableName: parameter.identifierName,
      variableType,
    },
  );
  return getCheckNodeReturn(contextWithVariable, variableType);
};

export const checkParameters = (
  context: AstCheckerContext,
  parameters: IdentifierExpressionAstNode[],
) => {
  const checkedParameters = parameters.reduce<{
    context: AstCheckerContext;
    parametersTypes: AstCheckerType[];
  }>(
    ({ context, parametersTypes: parameterTypes }, parameter) => {
      const checkedParameter = checkParameter(context, parameter);
      return {
        context: checkedParameter,
        parametersTypes: [...parameterTypes, checkedParameter.nodeType],
      };
    },
    {
      context,
      parametersTypes: [],
    },
  );
  return checkedParameters;
};
