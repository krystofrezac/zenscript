import type { AstNodeName } from '@sphere-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { addError } from './helpers/addError';
import { findVariableFromCurrentScope } from './helpers/findVariableFromCurrentScope';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';

export const checkIdentifierNode: CheckAstNode<
  AstNodeName.IdentifierExpression | AstNodeName.IdentifierType
> = (context, identifier) => {
  const referencedVariable = findVariableFromCurrentScope(
    context,
    identifier.identifierName,
  );
  if (!referencedVariable) {
    const contextWithError = addError(context, {
      name: AstCheckerErrorName.UnknownIdentifier,
      data: { identifier: identifier.identifierName },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  return getCheckNodeReturn(context, referencedVariable.variableType);
};
