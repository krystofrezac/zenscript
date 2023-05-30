import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { addError } from './helpers/addError';
import { AstCheckerErrorName } from '../types/errors';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';
import type { AstCheckerType } from '../types/types';

export const checkImportExpressionNode: CheckAstNode<
  AstNodeName.ImportExpression
> = (context, importExpression) => {
  const { filePath } = importExpression;

  if (!isPathValid(filePath)) {
    const contextWithError = addError(context, {
      name: AstCheckerErrorName.InvalidImportPath,
      data: { path: filePath },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  const importedFile = context.importFile(context.filePath, filePath);
  if (!importedFile) {
    const contextWithError = addError(context, {
      name: AstCheckerErrorName.FileNotFound,
      data: {},
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  const recordEntries: Record<string, AstCheckerType> =
    importedFile.exportedVariables.reduce(
      (acc, exportedVariable) => ({
        ...acc,
        [exportedVariable.variableName]: exportedVariable.variableType,
      }),
      {},
    );

  return getCheckNodeReturn(context, {
    name: AstCheckerTypeNames.Record,
    entries: recordEntries,
    hasValue: true,
  });
};

const filePathValidStarts = ['./', '../'];
const isPathValid = (path: string) =>
  filePathValidStarts.some(start => path.startsWith(start));
