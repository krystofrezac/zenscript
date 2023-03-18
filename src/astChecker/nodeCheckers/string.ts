import { AstNodeName } from '../../ast/types';
import { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkStringNode: CheckAstNode<AstNodeName.String> = (
  context,
  string,
) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.String,
    hasValue: string.hasValue,
  });
