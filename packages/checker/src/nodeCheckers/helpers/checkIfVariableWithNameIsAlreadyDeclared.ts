import type { AstCheckerContext } from '../../types';
import { AstCheckerErrorName } from '../../types/errors';
import { addError } from './addError';
import { findVariableInCurrentScope } from './findVariableInCurrentScope';
import { getCheckNodeReturn } from './getCheckNodeReturn';
import { ignoreAstCheckerNode } from './ignoreAstCheckerNode';

export const checkIfVariableWithNameIsAlreadyDeclared = (
  context: AstCheckerContext,
  variableName: string,
) => {
  const foundVariableInCurrentScope = findVariableInCurrentScope(
    context,
    variableName,
  );
  if (foundVariableInCurrentScope) {
    const contextWithError = addError(context, {
      name: AstCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
      data: { identifier: variableName },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }
  return undefined;
};
