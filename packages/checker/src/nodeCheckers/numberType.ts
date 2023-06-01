import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeName } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkNumberTypeNode: CheckAstNode<AstNodeName.NumberType> = (
  context,
  _numberType,
) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeName.Number,
    hasValue: false,
  });
