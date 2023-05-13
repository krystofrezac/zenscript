import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../../types';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';
import { getVariableAssignmentInfo } from './common';
import { emptyAstCheckerNode } from '../helpers/emptyAstCheckerNode';

export const checkVariableAssignmentNode: CheckAstNode<
  AstNodeName.VariableAssignment
> = (context, variableAssignment) => {
  const { context: variableAssignmentContext } = getVariableAssignmentInfo(
    context,
    variableAssignment,
  );

  return getCheckNodeReturn(variableAssignmentContext, emptyAstCheckerNode);
};
