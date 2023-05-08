import { checkAstNode } from '..';
import { AstNodeName } from '../../../ast/types';
import { IdentifierExpressionAstNode } from '../../../ast/types/expressionNodes';
import { AstCheckerContext, CheckAstNode } from '../../types';
import { AstCheckerType, AstCheckerTypeNames } from '../../types/types';
import { findVariableFromCurrentScope } from '../helpers/findVariableFromCurrentScope';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';
import {
  addVariableScope,
  removeVariableScope,
} from '../helpers/variableScopes';
import { checkFunctionDeclarationExpressionParameters } from './helpers/checkParameters';

export const checkFunctionDeclarationExpression: CheckAstNode<
  AstNodeName.FunctionDeclarationExpression
> = (context, functionDeclaration) => {
  const contextWithAddedVariableScope = addVariableScope(context);

  const { context: contextWithCheckedParameters, parametersTypes } =
    checkFunctionDeclarationExpressionParameters(
      contextWithAddedVariableScope,
      functionDeclaration.parameters,
    );

  // Parameters might get figured out in body/return
  const returnContext = checkAstNode(
    contextWithCheckedParameters,
    functionDeclaration.return,
  );
  const returnType = returnContext.nodeType;

  // Update figure out parameters
  const figuredOutParameters = getFiguredOutParameters(
    returnContext,
    parametersTypes,
    functionDeclaration.parameters,
  );

  const contextWithRemovedVariableScope = removeVariableScope(returnContext);

  return getCheckNodeReturn(contextWithRemovedVariableScope, {
    name: AstCheckerTypeNames.Function,
    parameters: figuredOutParameters,
    return: returnType,
    hasValue: returnType.hasValue,
  });
};

const getFiguredOutParameters = (
  contextWithFiguredOutParameters: AstCheckerContext,
  parametersType: AstCheckerType[],
  parametersAst: IdentifierExpressionAstNode[],
) => {
  const figuredOutItems = parametersType.map((parameter, index) => {
    if (parameter.name !== AstCheckerTypeNames.FigureOut) return parameter;

    const parameterAst = parametersAst[index];
    if (!parameterAst) return parameter;

    const figuredOut = findVariableFromCurrentScope(
      contextWithFiguredOutParameters,
      parameterAst.identifierName,
    );
    return figuredOut?.variableType ?? parameter;
  });

  return figuredOutItems;
};
