import { checkAstNode } from '.';
import { AstNodeName } from '../../typeAST/types';
import { pipe } from '../../helpers/pipe';
import { CheckAstNode, CheckAstNodeReturn, AstCheckerContext } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { addError, addErrors } from './helpers/addError';
import { addVariableToContext } from './helpers/addVariableToContext';
import { areTypesCompatible } from './helpers/areTypesCompatible';
import { checkIfVariableWithNameIsAlreadyDeclared } from './helpers/checkIfVariableWithNameIsAreadyDeclared';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { getNewErrors } from './helpers/getNewErrors';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';

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
    const returnContext = pipe(
      c => addErrors(c, implicitExplicitErrors),
      c => addIgnoreVariable(c, variableAssignment.variableName),
    )(context);

    return getCheckNodeReturn(returnContext, ignoreAstCheckerNode);
  }

  // Ignore when explicit or implicit type is ignored
  if (
    implicitNodeContext?.nodeType.name === AstCheckerTypeNames.Ignore ||
    explicitNodeContext?.nodeType.name === AstCheckerTypeNames.Ignore
  ) {
    const returnContext = addIgnoreVariable(
      context,
      variableAssignment.variableName,
    );
    return getCheckNodeReturn(returnContext, ignoreAstCheckerNode);
  }

  // Error when trying to use variable without value as value
  const contextWithWithoutValueError = checkWithoutValueError(
    context,
    implicitNodeContext,
  );
  if (contextWithWithoutValueError) {
    const returnContext = addIgnoreVariable(
      contextWithWithoutValueError,
      variableAssignment.variableName,
    );
    return getCheckNodeReturn(returnContext, ignoreAstCheckerNode);
  }

  const valueContext = explicitNodeContext ?? implicitNodeContext;
  // When explicit and implicit nodes are missing - should not happen, it's just for TS
  if (!valueContext) return getCheckNodeReturn(context, ignoreAstCheckerNode);

  // Error when explicit and implicit types are not compatible
  const contextWithTypeMismatchError = maybeAddTypeMismatchError(context, {
    explicitNodeContext,
    implicitNodeContext,
    variableName: variableAssignment.variableName,
  });

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
    name: AstCheckerTypeNames.Empty,
    hasValue: false,
  });
};

const checkWithoutValueError = (
  context: AstCheckerContext,
  implicitNodeContext?: CheckAstNodeReturn,
) => {
  if (implicitNodeContext && !implicitNodeContext.nodeType.hasValue) {
    return addError(context, {
      name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      data: { expressionType: implicitNodeContext.nodeType },
    });
  }
  return undefined;
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

const addIgnoreVariable = (context: AstCheckerContext, variableName: string) =>
  addVariableToContext(context, {
    variableName: variableName,
    variableType: ignoreAstCheckerNode,
  });
