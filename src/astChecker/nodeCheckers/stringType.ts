import { AstNodeName } from '../../ast/types';
import { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkStringTypeNode: CheckAstNode<AstNodeName.StringType> = (
  context,
  _stringType,
) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.String,
    hasValue: false,
  });
