import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkImportExpressionNode: CheckAstNode<
  AstNodeName.ImportExpression
> = (context, importExpression) => {
  const { filePath } = importExpression;
  const { exportedVariables } = context.importFile(context.filePath, filePath);

  return getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.Record,
    entries: exportedVariables.reduce(
      (acc, exportedVariable) => ({
        ...acc,
        [exportedVariable.variableName]: exportedVariable.variableType,
      }),
      {},
    ),
    hasValue: true,
  });
};
