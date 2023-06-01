import type { IdentifierExpressionAstNode } from '@zen-script/ast';
import type { AstCheckerContext } from '../../../types';
import type { AstCheckerType } from '../../../types/types';
import { AstCheckerTypeName } from '../../../types/types';
import { addVariableToContext } from '../../helpers/addVariableToContext';
import { checkAstNodes } from '../../helpers/checkAstNodes';
import { getErrorContextWhenVariableAlreadyDeclared } from '../../helpers/getErrorContextWhenVariableAlreadyDeclared';
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
  const alreadyDeclaredError = getErrorContextWhenVariableAlreadyDeclared(
    context,
    parameter.identifierName,
  );
  if (alreadyDeclaredError) {
    return alreadyDeclaredError;
  }

  const figureOutId = context.figureOutId + 1;
  const variableType: AstCheckerType = {
    name: AstCheckerTypeName.FigureOut,
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
