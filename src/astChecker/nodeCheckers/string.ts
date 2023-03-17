import { AstNodeName } from '../../ast/types';
import { CheckAstNode } from '../types';
import { CheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkStringNode: CheckAstNode<AstNodeName.String> = (
  context,
  string,
) =>
  getCheckNodeReturn(context, {
    name: CheckerTypeNames.String,
    hasValue: string.hasValue,
  });