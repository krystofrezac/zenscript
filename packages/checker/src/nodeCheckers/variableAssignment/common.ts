import type { VariableAssignmentAstNode } from '@zen-script/ast';
import type {
  AstCheckerContext,
  CheckAstNodeReturn,
  Variable,
} from '../../types';
import { pipe } from '@zen-script/helpers';
import { checkAstNode } from '..';
import { AstCheckerErrorName } from '../../types/errors';
import { AstCheckerTypeNames } from '../../types/types';
import { addErrors, addError } from '../helpers/addError';
import { addVariableToContext } from '../helpers/addVariableToContext';
import { areTypesCompatible } from '../helpers/areTypesCompatible';
import { checkIfVariableWithNameIsAlreadyDeclared } from '../helpers/checkIfVariableWithNameIsAlreadyDeclared';
import { getNewErrors } from '../helpers/getNewErrors';
import { ignoreAstCheckerNode } from '../helpers/ignoreAstCheckerNode';

type GetVariableAssignmentInfoReturn = {
  context: AstCheckerContext;
  variable?: Variable;
};

export const getVariableAssignmentInfo = (
  context: AstCheckerContext,
  variableAssignment: VariableAssignmentAstNode,
): GetVariableAssignmentInfoReturn => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    variableAssignment.identifierName,
  );
  if (alreadyDeclaredError) return { context: alreadyDeclaredError };

  const typeContext =
    variableAssignment.type && checkAstNode(context, variableAssignment.type);
  const expressionContext =
    variableAssignment.expression &&
    checkAstNode(context, variableAssignment.expression);

  const hasValue = expressionContext?.nodeType.hasValue ?? false;
  const ignoreVariable: Variable = {
    variableName: variableAssignment.identifierName,
    variableType: { name: AstCheckerTypeNames.Ignore, hasValue },
  };

  // Errors that originated from type and expression nodes
  const nodeErrors = [
    ...getNewErrors(expressionContext?.errors ?? [], context.errors),
    ...getNewErrors(typeContext?.errors ?? [], context.errors),
  ];
  if (nodeErrors.length > 0) {
    const returnContext = pipe(context)
      .to(c => addErrors(c, nodeErrors))
      .to(c => addIgnoreVariable(c, variableAssignment.identifierName))
      .result();

    return { context: returnContext, variable: ignoreVariable };
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
    return { context: returnContext, variable: ignoreVariable };
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
    return { context: returnContext, variable: ignoreVariable };
  }

  const valueContext = typeContext ?? expressionContext;
  // When explicit and implicit nodes are missing - should not happen, it's just for TS
  if (!valueContext) return { context };

  // Error when explicit and implicit types are not compatible
  const contextWithTypeMismatchError = maybeAddTypeMismatchError(context, {
    explicitNodeContext: typeContext,
    implicitNodeContext: expressionContext,
    variableName: variableAssignment.identifierName,
  });

  // Add variable to context
  const variable: Variable = {
    variableName: variableAssignment.identifierName,
    variableType: {
      ...valueContext.nodeType,
      hasValue,
    },
  };
  const contextWithVariable = addVariableToContext(
    contextWithTypeMismatchError,
    variable,
  );
  return { context: contextWithVariable, variable };
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
    variableName,
    variableType: ignoreAstCheckerNode,
  });
