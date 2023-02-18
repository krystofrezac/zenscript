import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { findVariableFromCurrentScope } from './helpers/findVariableFromCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkVariableReferenceNode: CheckTypeTreeNode<
  TypeTreeNodeName.VariableReference
> = (context, variableReference) => {
  const referencedVariable = findVariableFromCurrentScope(
    context,
    variableReference.variableName,
  );
  if (!referencedVariable) {
    const contextWithError = addError(context, {
      name: TypeTreeCheckerErrorName.UnknownIdentifier,
      data: { identifier: variableReference.variableName },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
    });
  }

  return getCheckNodeReturn(context, referencedVariable.variableType);
};
