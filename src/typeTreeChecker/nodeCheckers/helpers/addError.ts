import { TypeTreeCheckerContext } from '../../types';
import { TypeTreeCheckerError } from '../../types/errors';

export const addError = (
  context: TypeTreeCheckerContext,
  error: TypeTreeCheckerError,
): TypeTreeCheckerContext => ({
  ...context,
  errors: [...context.errors, error],
});

export const addErrors = (
  context: TypeTreeCheckerContext,
  errors: TypeTreeCheckerError[],
): TypeTreeCheckerContext => ({
  ...context,
  errors: [...context.errors, ...errors],
});
