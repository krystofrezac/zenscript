import type { AstNodeName } from '@zen-script/ast';
import type { AstCheckerContext, CheckAstNode } from '../../types';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';
import { getVariableAssignmentInfo } from './common';
import { emptyAstCheckerNode } from '../helpers/emptyAstCheckerNode';
import { addError } from '../helpers/addError';
import { AstCheckerErrorName } from '../../types/errors';

export const checkExportedVariableAssignmentNode: CheckAstNode<
  AstNodeName.ExportedVariableAssignment
> = (context, exportedVariableAssignment) => {
  const { context: variableAssignmentContext, variable } =
    getVariableAssignmentInfo(
      context,
      exportedVariableAssignment.variableAssignment,
    );

  if (!variable) {
    return getCheckNodeReturn(variableAssignmentContext, emptyAstCheckerNode);
  }

  const isInRoot = context.variableScopes.length === 1;
  if (!isInRoot) {
    const errorContext = addError(variableAssignmentContext, {
      name: AstCheckerErrorName.NestedExport,
      data: {},
    });
    return getCheckNodeReturn(errorContext, emptyAstCheckerNode);
  }

  const contextWithExportedVariable: AstCheckerContext = {
    ...variableAssignmentContext,
    exportedVariables: [
      ...variableAssignmentContext.exportedVariables,
      variable,
    ],
  };

  return getCheckNodeReturn(contextWithExportedVariable, emptyAstCheckerNode);
};
