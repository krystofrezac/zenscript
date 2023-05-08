import { IdentifierExpressionAstNode } from '../../../../ast/types/expressionNodes';
import { AstCheckerContext } from '../../../types';
import { AstCheckerType, AstCheckerTypeNames } from '../../../types/types';
import { addVariableToContext } from '../../helpers/addVariableToContext';
import { checkAstNodes } from '../../helpers/checkAstNodes';
import { checkIfVariableWithNameIsAlreadyDeclared } from '../../helpers/checkIfVariableWithNameIsAlreadyDeclared';
import { getCheckNodeReturn } from '../../helpers/getCheckNodeReturn';

export const checkFunctionDeclarationExpressionParameters = (
  context: AstCheckerContext,
  parameters: IdentifierExpressionAstNode[],
) => {
  const { context: checkedContext, nodeTypes } = checkAstNodes(
    context,
    parameters,
    checkFunctionDeclarationExpressionParameter,
  );
  return { context: checkedContext, parametersTypes: nodeTypes };
};

const checkFunctionDeclarationExpressionParameter = (
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
