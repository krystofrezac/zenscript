import type { AstCheckerContext } from '../../types';
import type { AstCheckerError } from '../../types/errors';

export const addError = (
  context: AstCheckerContext,
  error: AstCheckerError,
): AstCheckerContext => ({
  ...context,
  errors: [...context.errors, error],
});

export const addErrors = (
  context: AstCheckerContext,
  errors: AstCheckerError[],
): AstCheckerContext => ({
  ...context,
  errors: [...context.errors, ...errors],
});
