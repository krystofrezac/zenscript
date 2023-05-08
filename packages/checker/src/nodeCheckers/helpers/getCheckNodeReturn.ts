import { CheckAstNodeReturn, AstCheckerContext } from '../../types';
import { AstCheckerType } from '../../types/types';

export const getCheckNodeReturn = <
  TAstCheckerType extends AstCheckerType = AstCheckerType,
>(
  context: AstCheckerContext,
  nodeType: TAstCheckerType,
): CheckAstNodeReturn<TAstCheckerType> => ({ ...context, nodeType });
