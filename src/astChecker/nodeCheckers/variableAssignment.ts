import { checkAstNode } from '.';
import { AstNodeName } from '../../ast/types';
import { CheckAstNode, CheckAstNodeReturn, AstCheckerContext } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError, addErrors } from './helpers/addError';
import { addVariableToContext } from './helpers/addVariableToContext';
import { areTypesCompatible } from './helpers/areTypesCompatible';
import { checkIfVariableWithNameIsAlreadyDeclared } from './helpers/checkIfVariableWithNameIsAreadyDeclared';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { getNewErrors } from './helpers/getNewErrors';

export const checkVariableAssignmentNode: CheckAstNode<
  AstNodeName.VariableAssignment
> = (context, variableAssignment) => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    variableAssignment.variableName,
  );
  if (alreadyDeclaredError) return alreadyDeclaredError;

  const explicitNodeContext =
    variableAssignment.explicitType &&
    checkAstNode(context, variableAssignment.explicitType);
  const implicitNodeContext =
    variableAssignment.implicitType &&
    checkAstNode(context, variableAssignment.implicitType);

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

const maybeAddWithoutValueError = (
  context: AstCheckerContext,
  implicitNodeContext?: CheckAstNodeReturn,
) => {
  if (implicitNodeContext && !implicitNodeContext.nodeType.hasValue) {
    return addError(context, {
      name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      data: { expressionType: implicitNodeContext.nodeType },
    });
  }
  return context;
};

const maybeAddTypeMismatchError = (
  context: AstCheckerContext,
  {
    explicitNodeContext,
    implicitNodeContext,
    variableName,
  }: {
    explicitNodeContext?: CheckAstNodeReturn;
    implicitNodeContext?: CheckAstNodeReturn;
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
      name: AstCheckerErrorName.VariableTypeMismatch,
      data: {
        expected: explicitNodeContext.nodeType,
        received: implicitNodeContext.nodeType,
        variableName,
      },
    });
  }
  return context;
};
