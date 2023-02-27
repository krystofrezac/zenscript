import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { CheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkStringNode: CheckTypeTreeNode<TypeTreeNodeName.String> = (
  context,
  string,
) =>
  getCheckNodeReturn(context, {
    name: CheckerTypeNames.String,
    hasValue: string.hasValue,
  });
