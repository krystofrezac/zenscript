import { AstNodeName } from '../../ast/types';
import { CheckAstNode } from '../types';
import { CheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkNumberNode: CheckAstNode<AstNodeName.Number> = (
  context,
  number,
) =>
  getCheckNodeReturn(context, {
    name: CheckerTypeNames.Number,
    hasValue: number.hasValue,
  });
