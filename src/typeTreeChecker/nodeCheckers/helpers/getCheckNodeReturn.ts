import { CheckTypeTreeNodeReturn, TypeTreeCheckerContext } from '../../types';
import { CheckerType } from '../../types/types';

export const getCheckNodeReturn = <TNodeType extends CheckerType = CheckerType>(
  context: TypeTreeCheckerContext,
  type: TNodeType,
): CheckTypeTreeNodeReturn<TNodeType> => ({ ...context, nodeType: type });
