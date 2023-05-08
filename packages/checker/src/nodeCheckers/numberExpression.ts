import type { AstNodeName } from '@sphere-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkNumberExpressionNode: CheckAstNode<
  AstNodeName.NumberExpression
> = (context, _numberExpression) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.Number,
    hasValue: true,
  });
