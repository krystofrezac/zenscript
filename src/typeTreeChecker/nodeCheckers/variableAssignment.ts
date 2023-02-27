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
import {
  TypeTreeCheckerError,
  TypeTreeCheckerErrorName,
} from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError, addErrors } from './helpers/addError';
import { areTypesCompatible } from './helpers/areTypesCompatible';
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

  // Errors that originated from explicit and implicit nodes
  const implicitExplicitErrors = [
    ...getNewErrors(implicitNodeContext?.errors ?? [], context.errors),
    ...getNewErrors(explicitNodeContext?.errors ?? [], context.errors),
  ];
  if (implicitExplicitErrors.length > 0) {
    const contextWithErrors = addErrors(context, implicitExplicitErrors);
    return getCheckNodeReturn(contextWithErrors, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }

  // Error when trying to use variable without value as value
  const contextWithWithoutValueError = maybeAddWithoutValueError(
    context,
    implicitNodeContext,
  );

  const valueContext = explicitNodeContext ?? implicitNodeContext;
  // When explicit and implicit nodes are missing - should not happen, it's just for TS
  if (!valueContext)
    return getCheckNodeReturn(contextWithWithoutValueError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });

  // Error when explicit and implicit types are not compatible
  const contextWithTypeMismatchError = maybeAddTypeMismatchError(
    contextWithWithoutValueError,
    {
      explicitNodeContext,
      implicitNodeContext,
      variableName: variableAssignment.variableName,
    },
  );

  // Add variable to context
  const contextWithVariable = addVariableToContext(
    contextWithTypeMismatchError,
    {
      variableName: variableAssignment.variableName,
      variableType: {
        ...valueContext.nodeType,
        hasValue: implicitNodeContext?.nodeType.hasValue ?? false,
      },
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

const maybeAddTypeMismatchError = (
  context: TypeTreeCheckerContext,
  {
    explicitNodeContext,
    implicitNodeContext,
    variableName,
  }: {
    explicitNodeContext?: CheckTypeTreeNodeReturn;
    implicitNodeContext?: CheckTypeTreeNodeReturn;
    variableName: string;
  },
) => {
  if (!explicitNodeContext || !implicitNodeContext) return context;
  if (
    !areTypesCompatible(
      explicitNodeContext.nodeType,
      implicitNodeContext?.nodeType,
    )
  ) {
    return addError(context, {
      name: TypeTreeCheckerErrorName.VariableTypeMismatch,
      data: {
        expected: explicitNodeContext.nodeType,
        received: implicitNodeContext.nodeType,
        variableName,
      },
    });
  }
  return context;
};

const getNewErrors = (
  errors: TypeTreeCheckerError[],
  originalErrors: TypeTreeCheckerError[],
) => errors.slice(originalErrors.length);

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
