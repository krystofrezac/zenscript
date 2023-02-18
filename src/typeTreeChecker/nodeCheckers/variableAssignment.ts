import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode, TypeTreeCheckerContext, Variable } from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { findVariableInCurrentScope } from './helpers/findVariableInCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkVariableAssignmentNode: CheckTypeTreeNode<
  TypeTreeNodeName.VariableAssignment
> = (context, variableAssignment) => {
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
    });
  }

  const explicitNodeContext =
    variableAssignment.explicitTypeNode &&
    checkTypeTreeNode(context, variableAssignment.explicitTypeNode);
  const implicitNodeContext =
    variableAssignment.implicitTypeNode &&
    checkTypeTreeNode(context, variableAssignment.implicitTypeNode);
  const valueContext = explicitNodeContext ?? implicitNodeContext;
  if (!valueContext)
    return getCheckNodeReturn(context, { name: CheckerTypeNames.Empty });

  const contextWithVariable = addVariableToContext(valueContext, {
    variableName: variableAssignment.variableName,
    variableType: valueContext.nodeType,
  });

  return getCheckNodeReturn(contextWithVariable, {
    name: CheckerTypeNames.Empty,
  });
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
