import { CheckAstNodeReturn, AstCheckerContext } from '../../types';
import { AstCheckerType } from '../../types/types';

export const getCheckNodeReturn = <
  TNodeType extends AstCheckerType = AstCheckerType,
>(
  context: AstCheckerContext,
  type: TNodeType,
): CheckAstNodeReturn<TNodeType> => ({ ...context, nodeType: type });
