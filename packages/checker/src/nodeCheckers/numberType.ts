import type { AstNodeName } from '@sphere-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkNumberTypeNode: CheckAstNode<AstNodeName.NumberType> = (
  context,
  _numberType,
) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.Number,
    hasValue: false,
  });
