import { checkTypeTreeNode } from '.';
import {
  TypeTreeNodeName,
  VariableAssignmentNode,
} from '../../getTypeTree/types';
import {
  CheckTypeTreeNode,
  CheckTypeTreeNodeReturn,
  TypeTreeCheckerContext,
  Variable,
} from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError, addErrors } from './helpers/addError';
import { findVariableInCurrentScope } from './helpers/findVariableInCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkVariableAssignmentNode: CheckTypeTreeNode<
  TypeTreeNodeName.VariableAssignment
> = (context, variableAssignment) => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    variableAssignment,
  );
  if (alreadyDeclaredError) return alreadyDeclaredError;

  const explicitNodeContext =
    variableAssignment.explicitTypeNode &&
    checkTypeTreeNode(context, variableAssignment.explicitTypeNode);
  const implicitNodeContext =
    variableAssignment.implicitTypeNode &&
    checkTypeTreeNode(context, variableAssignment.implicitTypeNode);

  const implicitExplicitErrors = [
    ...(implicitNodeContext?.errors ?? []),
    ...(explicitNodeContext?.errors ?? []),
  ];
  if (implicitExplicitErrors.length > 0) {
    const contextWithErrors = addErrors(context, implicitExplicitErrors);
    return getCheckNodeReturn(contextWithErrors, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }

  const contextWithWithoutValueError = maybeAddWithoutValueError(
    context,
    implicitNodeContext,
  );

  const valueContext = explicitNodeContext ?? implicitNodeContext;
  if (!valueContext)
    return getCheckNodeReturn(contextWithWithoutValueError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });

  const contextWithVariable = addVariableToContext(
    contextWithWithoutValueError,
    {
      variableName: variableAssignment.variableName,
      variableType: valueContext.nodeType,
    },
  );

  return getCheckNodeReturn(contextWithVariable, {
    name: CheckerTypeNames.Empty,
    hasValue: false,
  });
};

const checkIfVariableWithNameIsAlreadyDeclared = (
  context: TypeTreeCheckerContext,
  variableAssignment: VariableAssignmentNode,
) => {
  const foundVariableInCurrentScope = findVariableInCurrentScope(
    context,
    variableAssignment.variableName,
  );
  if (foundVariableInCurrentScope) {
    const contextWithError = addError(context, {
      name: TypeTreeCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
      data: { identifier: variableAssignment.variableName },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }
};

const maybeAddWithoutValueError = (
  context: TypeTreeCheckerContext,
  implicitNodeContext?: CheckTypeTreeNodeReturn,
) => {
  if (implicitNodeContext && !implicitNodeContext.nodeType.hasValue) {
    return addError(context, {
      name: TypeTreeCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      data: { expressionType: implicitNodeContext.nodeType },
    });
  }
  return context;
};

const addVariableToContext = (
  context: TypeTreeCheckerContext,
  variable: Variable,
): TypeTreeCheckerContext => {
  const variableScopesHead = context.variableScopes.slice(0, -1);
  const variableScopesTail = context.variableScopes.at(-1);
  if (!variableScopesTail) return context;
  return {
    ...context,
    variableScopes: [...variableScopesHead, [...variableScopesTail, variable]],
  };
};
