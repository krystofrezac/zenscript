import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode, TypeTreeCheckerContext } from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTupleType, CheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { areTypesCompatible } from './helpers/areTypesCompatible';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { updateFigureOutType } from './helpers/updateVariableType';

export const checkFunctionCall: CheckTypeTreeNode<
  TypeTreeNodeName.FunctionCall
> = (context, functionCall) => {
  const calleeContext = checkTypeTreeNode(context, functionCall.callee);

  // callee doesn't have value
  if (!calleeContext.nodeType.hasValue) {
    const contextWithError = addError(calleeContext, {
      name: TypeTreeCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      data: {
        expressionType: calleeContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }

  // callee is not callable
  if (calleeContext.nodeType.name !== CheckerTypeNames.Function) {
    const contextWithError = addError(calleeContext, {
      name: TypeTreeCheckerErrorName.CallingNonCallableExpression,
      data: {
        callee: calleeContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }

  const argumentsContext = checkTypeTreeNode(
    calleeContext,
    functionCall.arguments,
  );
  const argumentsType = argumentsContext.nodeType;
  const parametersType = calleeContext.nodeType.parameters;

  // arguments and parameters are not compatible
  if (
    !areTypesCompatible(parametersType, argumentsType, {
      figureOutEnabled: true,
    })
  ) {
    const contextWithError = addError(argumentsContext, {
      name: TypeTreeCheckerErrorName.FunctionParametersMismatch,
      data: {
        expected: calleeContext.nodeType.parameters,
        received: argumentsContext.nodeType,
      },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }

  if (argumentsType.name !== CheckerTypeNames.Tuple) {
    return getCheckNodeReturn(argumentsContext, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
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
  originalContext: TypeTreeCheckerContext,
  argumentsType: CheckerTupleType,
  parametersType: CheckerTupleType,
): TypeTreeCheckerContext => {
  const newContext = argumentsType.items.reduce((context, argument, index) => {
    if (argument.name !== CheckerTypeNames.FigureOut) return context;

    const parameterType = parametersType.items[index];

    if (!parameterType) return context;

    return updateFigureOutType(context, {
      figureOutId: argument.id,
      updatedType: parameterType,
    });
  }, originalContext);

  return newContext;
};
