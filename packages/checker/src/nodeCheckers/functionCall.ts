import type { AstNode, AstNodeName } from '@zen-script/ast';
import { checkAstNode } from '.';
import type { AstCheckerContext, CheckAstNode } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import type { AstCheckerType } from '../types/types';
import { AstCheckerTypeName } from '../types/types';
import { addError } from './helpers/addError';
import { isSubtypeOf } from './helpers/isSubtypeOf';
import { checkAstNodes } from './helpers/checkAstNodes';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';
import { updateFigureOutType } from './helpers/updateVariableType';

export const checkFunctionCall: CheckAstNode<
  AstNodeName.FunctionCallExpression | AstNodeName.FunctionCallType
> = (context, functionCall) => {
  const calleeContext = checkAstNode(context, functionCall.callee);

  // callee doesn't have value
  if (!calleeContext.nodeType.hasValue) {
    const contextWithError = addError(calleeContext, {
      name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      data: {
        expressionType: calleeContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  // callee is not callable
  if (calleeContext.nodeType.name !== AstCheckerTypeName.Function) {
    const contextWithError = addError(calleeContext, {
      name: AstCheckerErrorName.CallingNonCallableExpression,
      data: {
        callee: calleeContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  const { context: argumentsContext, nodeTypes: argumentsType } =
    checkAstNodes<AstNode>(calleeContext, functionCall.arguments, checkAstNode);
  const parametersType = calleeContext.nodeType.parameters;

  // arguments and parameters are not compatible
  if (
    !isSubtypeOf(parametersType, argumentsType, {
      figureOutEnabled: true,
    })
  ) {
    const contextWithError = addError(argumentsContext, {
      name: AstCheckerErrorName.FunctionParametersMismatch,
      data: {
        expected: calleeContext.nodeType.parameters,
        received: argumentsType,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  const figuredOutArgumentsContext = figureOutArguments(
    argumentsContext,
    argumentsType,
    parametersType,
  );

  const returnType = calleeContext.nodeType.return;
  return getCheckNodeReturn(figuredOutArgumentsContext, returnType);
};

const figureOutArguments = (
  originalContext: AstCheckerContext,
  argumentsType: AstCheckerType[],
  parametersType: AstCheckerType[],
): AstCheckerContext => {
  const newContext = argumentsType.reduce((context, argument, index) => {
    if (argument.name !== AstCheckerTypeName.FigureOut) return context;

    const parameterType = parametersType[index];
    if (!parameterType) return context;

    return updateFigureOutType(context, {
      figureOutId: argument.id,
      updatedType: parameterType,
    });
  }, originalContext);

  return newContext;
};
