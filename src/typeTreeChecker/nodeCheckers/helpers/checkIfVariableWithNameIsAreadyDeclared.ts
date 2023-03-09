import { TypeTreeCheckerContext } from '../../types';
import { TypeTreeCheckerErrorName } from '../../types/errors';
import { CheckerTypeNames } from '../../types/types';
import { addError } from './addError';
import { findVariableInCurrentScope } from './findVariableInCurrentScope';
import { getCheckNodeReturn } from './getCheckNodeReturn';

export const checkIfVariableWithNameIsAlreadyDeclared = (
  context: TypeTreeCheckerContext,
  variableName: string,
) => {
  const foundVariableInCurrentScope = findVariableInCurrentScope(
    context,
    variableName,
  );
  if (foundVariableInCurrentScope) {
    const contextWithError = addError(context, {
      name: TypeTreeCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
      data: { identifier: variableName },
    });
    return getCheckNodeReturn(contextWithError, {
      name: CheckerTypeNames.Empty,
      hasValue: false,
    });
  }
  return undefined;
};
