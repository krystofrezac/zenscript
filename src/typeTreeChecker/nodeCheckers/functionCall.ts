import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkFunctionCall: CheckTypeTreeNode<
  TypeTreeNodeName.FunctionCall
> = (context, functionDeclaration) => {
  const calleeContext = checkTypeTreeNode(context, functionDeclaration.callee);

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

  const returnType = calleeContext.nodeType.return;

  return getCheckNodeReturn(calleeContext, returnType);
};
