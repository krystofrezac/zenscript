import type { AstCheckerError } from '../../types/errors';

export const getNewErrors = (
  errors: AstCheckerError[],
  originalErrors: AstCheckerError[],
) => errors.slice(originalErrors.length);
