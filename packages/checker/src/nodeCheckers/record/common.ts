import type {
  AstNodeName,
  RecordEntryExpressionAstNode,
  RecordEntryTypeAstNode,
} from '@zen-script/ast';
import { checkAstNode } from '..';
import type { CheckAstNode, AstCheckerContext } from '../../types';
import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeName } from '../../types/types';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';

export const getCheckRecordNode =
  (
    hasValue: boolean,
  ): CheckAstNode<AstNodeName.RecordExpression | AstNodeName.RecordType> =>
  (context, record) => {
    const { context: entriesContext, entriesType } = getEntriesType(
      context,
      record.entries,
    );

    return getCheckNodeReturn(entriesContext, {
      name: AstCheckerTypeName.Record,
      entries: entriesType,
      hasValue,
    });
  };

type GetEntriesTypeReturn = {
  context: AstCheckerContext;
  entriesType: Record<string, AstCheckerType>;
};
const getEntriesType = (
  context: AstCheckerContext,
  entries: (RecordEntryExpressionAstNode | RecordEntryTypeAstNode)[],
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
