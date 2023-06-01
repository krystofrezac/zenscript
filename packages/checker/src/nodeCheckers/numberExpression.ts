import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeName } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkNumberExpressionNode: CheckAstNode<
  AstNodeName.NumberExpression
> = (context, _numberExpression) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeName.Number,
    hasValue: true,
  });
