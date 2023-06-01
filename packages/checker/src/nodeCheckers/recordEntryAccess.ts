import type { AstNodeName } from '@zen-script/ast';
import { checkAstNode } from '.';
import type { CheckAstNode } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeName } from '../types/types';
import { addError } from './helpers/addError';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { ignoreAstCheckerNode } from './helpers/ignoreAstCheckerNode';

export const checkRecordEntryAccessNode: CheckAstNode<
  AstNodeName.RecordEntryAccessExpression | AstNodeName.RecordEntryAccessType
> = (context, recordEntryAccess) => {
  const accessingContext = checkAstNode(context, recordEntryAccess.accessing);
  const accessingType = accessingContext.nodeType;

  if (accessingType.name !== AstCheckerTypeName.Record) {
    const contextWithError = addError(accessingContext, {
      name: AstCheckerErrorName.AccessingNonRecord,
      data: {
        accessing: accessingType.name,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  const accessedEntry = accessingType.entries[recordEntryAccess.entryName];
  if (!accessedEntry) {
    const contextWithError = addError(accessingContext, {
      name: AstCheckerErrorName.EntryDoesNotExistOnRecord,
      data: {
        record: accessingType,
        entryName: recordEntryAccess.entryName,
      },
    });
    return getCheckNodeReturn(contextWithError, ignoreAstCheckerNode);
  }

  return getCheckNodeReturn(context, accessedEntry);
};
