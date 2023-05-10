import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkStringExpressionNode: CheckAstNode<
  AstNodeName.StringExpression
> = (context, _stringExpression) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.String,
    hasValue: true,
  });
