import { AstNodeName } from '../../ast/types';
import { CheckAstNode } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { addError } from './helpers/addError';
import { findVariableFromCurrentScope } from './helpers/findVariableFromCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkVariableReferenceNode: CheckAstNode<
  AstNodeName.VariableReference
> = (context, variableReference) => {
  const referencedVariable = findVariableFromCurrentScope(
    context,
    variableReference.variableName,
  );
  if (!referencedVariable) {
    const contextWithError = addError(context, {
      name: AstCheckerErrorName.UnknownIdentifier,
      data: { identifier: variableReference.variableName },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }

  return getCheckNodeReturn(context, referencedVariable.variableType);
};
