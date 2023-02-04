import {
  findVariableInCurrentScope,
  addError,
  addVariableToCurrentScope,
} from '../checkerContext';
import { CheckerContext, Type } from '../types';
import { areTypesCompatible } from './areTypesCompatible';

export const checkVariableAssignmentTypeAndRegister = (
  context: CheckerContext,
  {
    name,
    primaryType,
    secondaryType,
    hasValue,
  }: {
    name: string;
    primaryType: Type;
    secondaryType?: Type;
    hasValue: boolean;
  },
) => {
  if (findVariableInCurrentScope(context, name)) {
    addError(context, {
      message: `variable with name '${name}' is already declared in this scope`,
    });
    return;
  }
  if (secondaryType && !areTypesCompatible(primaryType, secondaryType)) {
    addError(context, {
      message: `variable '${name}' has incorrect type ${JSON.stringify(
        primaryType,
      )} expected ${JSON.stringify(secondaryType)}`,
    });
  }

  addVariableToCurrentScope(context, {
    name,
    type: primaryType,
    hasValue,
  });
};
