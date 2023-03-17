import { checkAstNode } from '.';
import { TupleAstNode, AstNodeName } from '../../ast/types';
import { CheckAstNode, AstCheckerContext } from '../types';
import { AstCheckerTupleType, CheckerTypeNames } from '../types/types';
import { findVariableFromCurrentScope } from './helpers/findVariableFromCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import {
  addVariableScope,
  removeVariableScope,
} from './helpers/variableScopes';

export const checkFunctionDeclaration: CheckAstNode<
  AstNodeName.FunctionDeclaration
> = (context, functionDeclaration) => {
  const contextWithAddedVariableScope = addVariableScope(context);

  const parametersContext = checkAstNode(
    contextWithAddedVariableScope,
    functionDeclaration.parameters,
  );
  const parametersType = parametersContext.nodeType;

  // Just for TS - parametersType should always be tuple
  if (parametersType.name !== CheckerTypeNames.Tuple)
    return getCheckNodeReturn(parametersContext, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });

  const returnContext = checkAstNode(
    parametersContext,
    functionDeclaration.return,
  );
  const returnType = returnContext.nodeType;

  const figuredOutParameters = getFiguredOutParameters(
    returnContext,
    parametersType,
    functionDeclaration.parameters,
  );

  const contextWithRemovedVariableScope = removeVariableScope(returnContext);

  return getCheckNodeReturn(contextWithRemovedVariableScope, {
    name: CheckerTypeNames.Function,
    parameters: figuredOutParameters,
    return: returnType,
    hasValue: returnType.hasValue,
  });
};

const getFiguredOutParameters = (
  context: AstCheckerContext,
  parametersType: AstCheckerTupleType,
  parametersAST: TupleAstNode,
): AstCheckerTupleType => {
  const figuredOutItems = parametersType.items.map((parameter, index) => {
    if (parameter.name !== CheckerTypeNames.FigureOut) return parameter;

    const parameterAST = parametersAST.items[index];
    if (!parameterAST || parameterAST.name !== AstNodeName.Parameter)
      return parameter;

    const figuredOut = findVariableFromCurrentScope(
      context,
      parameterAST.parameterName,
    );
    return figuredOut?.variableType ?? parameter;
  });

  return { ...parametersType, items: figuredOutItems };
};
