import { CheckTypeTreeNodeReturn, TypeTreeCheckerContext } from '../../types';
import { CheckerType } from '../../types/types';

export const getCheckNodeReturn = (
  context: TypeTreeCheckerContext,
  type: CheckerType,
): CheckTypeTreeNodeReturn => ({ ...context, nodeType: type });
