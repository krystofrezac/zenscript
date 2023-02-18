import { TypeTreeCheckerContext } from '../../types';
import { TypeTreeCheckerError } from '../../types/errors';

export const addError = (
  context: TypeTreeCheckerContext,
  error: TypeTreeCheckerError,
): TypeTreeCheckerContext => ({
  ...context,
  errors: [...context.errors, error],
});
