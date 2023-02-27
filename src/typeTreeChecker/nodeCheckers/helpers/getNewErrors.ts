import { TypeTreeCheckerError } from '../../types/errors';

export const getNewErrors = (
  errors: TypeTreeCheckerError[],
  originalErrors: TypeTreeCheckerError[],
) => errors.slice(originalErrors.length);
