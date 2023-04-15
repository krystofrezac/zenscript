import { AstNodeName } from '../../typeAST/types';
import { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkNumberNode: CheckAstNode<AstNodeName.Number> = (
  context,
  number,
) =>
  getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.Number,
    hasValue: number.hasValue,
  });
