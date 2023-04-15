import { checkAstNode } from '.';
import { AstNodeName } from '../../typeAST/types';
import { CheckAstNode, AstCheckerContext } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTupleType, AstCheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { areTypesCompatible } from './helpers/areTypesCompatible';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';
import { updateFigureOutType } from './helpers/updateVariableType';

export const checkFunctionCall: CheckAstNode<AstNodeName.FunctionCall> = (
  context,
  functionCall,
) => {
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
  if (calleeContext.nodeType.name !== AstCheckerTypeNames.Function) {
    const contextWithError = addError(calleeContext, {
      name: AstCheckerErrorName.CallingNonCallableExpression,
      data: {
        callee: calleeContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  const argumentsContext = checkAstNode(calleeContext, functionCall.arguments);
  const argumentsType = argumentsContext.nodeType;
  const parametersType = calleeContext.nodeType.parameters;

  // arguments and parameters are not compatible
  if (
    !areTypesCompatible(parametersType, argumentsType, {
      figureOutEnabled: true,
    })
  ) {
    const contextWithError = addError(argumentsContext, {
      name: AstCheckerErrorName.FunctionParametersMismatch,
      data: {
        expected: calleeContext.nodeType.parameters,
        received: argumentsContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  // should not happen - just for TS
  if (argumentsType.name !== AstCheckerTypeNames.Tuple) {
    return getCheckNodeReturn(argumentsContext, ignoreAstCheckerNode);
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
  argumentsType: AstCheckerTupleType,
  parametersType: AstCheckerTupleType,
): AstCheckerContext => {
  const newContext = argumentsType.items.reduce((context, argument, index) => {
    if (argument.name !== AstCheckerTypeNames.FigureOut) return context;

    const parameterType = parametersType.items[index];
    if (!parameterType) return context;

    return updateFigureOutType(context, {
      figureOutId: argument.id,
      updatedType: parameterType,
    });
  }, originalContext);

  return newContext;
};
