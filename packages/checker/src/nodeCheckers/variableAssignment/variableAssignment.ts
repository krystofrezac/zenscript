import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../../types';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';
import { getVariableAssignmentInfo } from './common';
import { emptyAstCheckerNode } from '../helpers/emptyAstCheckerNode';

export const checkVariableAssignmentNode: CheckAstNode<
  AstNodeName.VariableAssignment
> = (context, variableAssignment) => {
  const { context: variableAssignmentContext, variable } =
    getVariableAssignmentInfo(context, variableAssignment);

  if (!variable) {
    return getCheckNodeReturn(variableAssignmentContext, emptyAstCheckerNode);
  }

  return getCheckNodeReturn(variableAssignmentContext, emptyAstCheckerNode);
};
