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
import { getErrorContextWhenVariableAlreadyDeclared } from '../helpers/getErrorContextWhenVariableAlreadyDeclared';
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
  const errorContextWhenVariableAlreadyDeclared =
    getErrorContextWhenVariableAlreadyDeclared(
      context,
      variableAssignment.identifierName,
    );
  if (errorContextWhenVariableAlreadyDeclared)
    return { context: errorContextWhenVariableAlreadyDeclared };

  const typeContext =
    variableAssignment.type && checkAstNode(context, variableAssignment.type);
  const expressionContext =
    variableAssignment.expression &&
    checkAstNode(context, variableAssignment.expression);

  const errorResultWhenNodesHaveErrors = getErrorResultWhenNodesHaveErrors({
    context,
    variableAssignment,
    typeContext,
    expressionContext,
  });
  if (errorResultWhenNodesHaveErrors) return errorResultWhenNodesHaveErrors;

  const ignoredResultWhenSomeNodeIgnored = getIgnoredResultWhenSomeNodeIgnored({
    context,
    variableAssignment,
    typeContext,
    expressionContext,
  });
  if (ignoredResultWhenSomeNodeIgnored) return ignoredResultWhenSomeNodeIgnored;

  const errorResultWhenExpressionDoesNotHaveValue =
    getErrorResultWhenExpressionDoesNotHaveValue({
      context,
      variableAssignment,
      expressionContext,
    });
  if (errorResultWhenExpressionDoesNotHaveValue)
    return errorResultWhenExpressionDoesNotHaveValue;

  const valueContext = typeContext ?? expressionContext;
  // When explicit and implicit nodes are missing - should not happen, it's just for TS
  if (!valueContext) return { context };

  const contextWithErrorWhenNodesHaveIncompatibleTypes =
    addErrorWhenNodesHaveIncompatibleTypes({
      context,
      explicitNodeContext: typeContext,
      implicitNodeContext: expressionContext,
      variableName: variableAssignment.identifierName,
    });

  const variable: Variable = {
    variableName: variableAssignment.identifierName,
    variableType: {
      ...valueContext.nodeType,
      hasValue: expressionContext?.nodeType.hasValue ?? false,
    },
  };
  const contextWithVariable = addVariableToContext(
    contextWithErrorWhenNodesHaveIncompatibleTypes,
    variable,
  );
  return { context: contextWithVariable, variable };
};

const getIgnoredVariable = ({
  variableAssignment,
}: {
  variableAssignment: VariableAssignmentAstNode;
}): Variable => ({
  variableName: variableAssignment.identifierName,
  variableType: ignoreAstCheckerNode,
});
const addIgnoreVariableToContext = (
  context: AstCheckerContext,
  variableName: string,
) =>
  addVariableToContext(context, {
    variableName,
    variableType: ignoreAstCheckerNode,
  });

const getErrorResultWhenNodesHaveErrors = ({
  context,
  variableAssignment,
  typeContext,
  expressionContext,
}: {
  context: AstCheckerContext;
  variableAssignment: VariableAssignmentAstNode;
  typeContext: CheckAstNodeReturn | undefined;
  expressionContext: CheckAstNodeReturn | undefined;
}) => {
  const nodeErrors = [
    ...getNewErrors(expressionContext?.errors ?? [], context.errors),
    ...getNewErrors(typeContext?.errors ?? [], context.errors),
  ];
  if (nodeErrors.length === 0) return undefined;

  const returnContext = pipe(context)
    .to(c => addErrors(c, nodeErrors))
    .to(c => addIgnoreVariableToContext(c, variableAssignment.identifierName))
    .result();

  return {
    context: returnContext,
    variable: getIgnoredVariable({ variableAssignment }),
  };
};
const getIgnoredResultWhenSomeNodeIgnored = ({
  context,
  variableAssignment,
  typeContext,
  expressionContext,
}: {
  context: AstCheckerContext;
  variableAssignment: VariableAssignmentAstNode;
  typeContext: CheckAstNodeReturn | undefined;
  expressionContext: CheckAstNodeReturn | undefined;
}) => {
  if (
    expressionContext?.nodeType.name !== AstCheckerTypeNames.Ignore &&
    typeContext?.nodeType.name !== AstCheckerTypeNames.Ignore
  )
    return undefined;

  const returnContext = addIgnoreVariableToContext(
    context,
    variableAssignment.identifierName,
  );
  return {
    context: returnContext,
    variable: getIgnoredVariable({ variableAssignment }),
  };
};

const getErrorResultWhenExpressionDoesNotHaveValue = ({
  context,
  variableAssignment,
  expressionContext,
}: {
  context: AstCheckerContext;
  variableAssignment: VariableAssignmentAstNode;
  expressionContext: CheckAstNodeReturn | undefined;
}) => {
  if (!expressionContext || expressionContext?.nodeType.hasValue)
    return undefined;

  const contextWithWithoutValueError = addError(context, {
    name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
    data: { expressionType: expressionContext.nodeType },
  });
  const returnContext = addIgnoreVariableToContext(
    contextWithWithoutValueError,
    variableAssignment.identifierName,
  );
  return {
    context: returnContext,
    variable: getIgnoredVariable({ variableAssignment }),
  };
};

const addErrorWhenNodesHaveIncompatibleTypes = ({
  context,
  explicitNodeContext,
  implicitNodeContext,
  variableName,
}: {
  context: AstCheckerContext;
  explicitNodeContext?: CheckAstNodeReturn;
  implicitNodeContext?: CheckAstNodeReturn;
  variableName: string;
}) => {
  if (
    !explicitNodeContext ||
    !implicitNodeContext ||
    areTypesCompatible(
      explicitNodeContext.nodeType,
      implicitNodeContext?.nodeType,
    )
  )
    return context;

  return addError(context, {
    name: AstCheckerErrorName.VariableTypeMismatch,
    data: {
      expected: explicitNodeContext.nodeType,
      received: implicitNodeContext.nodeType,
      variableName,
    },
  });
};
