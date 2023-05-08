import type { AstNodeName } from '@sphere-script/ast';
import { checkAstNode } from '.';
import type {
  CheckAstNode,
  CheckAstNodeReturn,
  AstCheckerContext,
} from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { addError, addErrors } from './helpers/addError';
import { addVariableToContext } from './helpers/addVariableToContext';
import { areTypesCompatible } from './helpers/areTypesCompatible';
import { checkIfVariableWithNameIsAlreadyDeclared } from './helpers/checkIfVariableWithNameIsAlreadyDeclared';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { getNewErrors } from './helpers/getNewErrors';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';
import { pipe } from '@sphere-script/helpers';

export const checkVariableAssignmentNode: CheckAstNode<
  AstNodeName.VariableAssignment
> = (context, variableAssignment) => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    variableAssignment.identifierName,
  );
  if (alreadyDeclaredError) return alreadyDeclaredError;

  const typeContext =
    variableAssignment.type && checkAstNode(context, variableAssignment.type);
  const expressionContext =
    variableAssignment.expression &&
    checkAstNode(context, variableAssignment.expression);

  // Errors that originated from type and expression nodes
  const nodeErrors = [
    ...getNewErrors(expressionContext?.errors ?? [], context.errors),
    ...getNewErrors(typeContext?.errors ?? [], context.errors),
  ];
  if (nodeErrors.length > 0) {
    const returnContext = pipe(
      c => addErrors(c, nodeErrors),
      c => addIgnoreVariable(c, variableAssignment.identifierName),
    )(context);

    return getCheckNodeReturn(returnContext, ignoreAstCheckerNode);
  }

  // Ignore when explicit or implicit type is ignored
  if (
    expressionContext?.nodeType.name === AstCheckerTypeNames.Ignore ||
    typeContext?.nodeType.name === AstCheckerTypeNames.Ignore
  ) {
    const returnContext = addIgnoreVariable(
      context,
      variableAssignment.identifierName,
    );
    return getCheckNodeReturn(returnContext, ignoreAstCheckerNode);
  }

  // Error when trying to use variable without value as value
  const contextWithWithoutValueError = checkWithoutValueError(
    context,
    expressionContext,
  );
  if (contextWithWithoutValueError) {
    const returnContext = addIgnoreVariable(
      contextWithWithoutValueError,
      variableAssignment.identifierName,
    );
    return getCheckNodeReturn(returnContext, ignoreAstCheckerNode);
  }

  const valueContext = typeContext ?? expressionContext;
  // When explicit and implicit nodes are missing - should not happen, it's just for TS
  if (!valueContext) return getCheckNodeReturn(context, ignoreAstCheckerNode);

  // Error when explicit and implicit types are not compatible
  const contextWithTypeMismatchError = maybeAddTypeMismatchError(context, {
    explicitNodeContext: typeContext,
    implicitNodeContext: expressionContext,
    variableName: variableAssignment.identifierName,
  });

  // Add variable to context
  const contextWithVariable = addVariableToContext(
    contextWithTypeMismatchError,
    {
      variableName: variableAssignment.identifierName,
      variableType: {
        ...valueContext.nodeType,
        hasValue: expressionContext?.nodeType.hasValue ?? false,
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
