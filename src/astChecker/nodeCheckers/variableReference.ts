import { AstNodeName } from '../../typeAST/types';
import { CheckAstNode } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { addError } from './helpers/addError';
import { findVariableFromCurrentScope } from './helpers/findVariableFromCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';

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
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  return getCheckNodeReturn(context, referencedVariable.variableType);
};
