import { checkAstNode } from '.';
import { AstNodeName, RecordEntryAstNode } from '../../ast/types';
import { AstCheckerContext, CheckAstNode } from '../types';
import { AstCheckerType, AstCheckerTypeNames } from '../types/types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkRecordNode: CheckAstNode<AstNodeName.Record> = (
  context,
  record,
) => {
  const { context: entriesContext, entriesType } = getEntriesType(
    context,
    record.entries,
  );

  return getCheckNodeReturn(entriesContext, {
    name: AstCheckerTypeNames.Record,
    entries: entriesType,
    hasValue: record.hasValue,
  });
};

type GetEntriesTypeReturn = {
  context: AstCheckerContext;
  entriesType: Record<string, AstCheckerType>;
};
const getEntriesType = (
  context: AstCheckerContext,
  entries: RecordEntryAstNode[],
): GetEntriesTypeReturn =>
  entries.reduce<GetEntriesTypeReturn>(
    (previous, entry) => {
      const entryContext = checkAstNode(previous.context, entry.value);
      return {
        context: entryContext,
        entriesType: {
          ...previous.entriesType,
          [entry.key]: entryContext.nodeType,
        },
      };
    },
    { context, entriesType: {} },
  );
