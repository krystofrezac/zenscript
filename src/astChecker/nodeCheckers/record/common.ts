import { checkAstNode } from '..';
import { AstNodeName } from '../../../ast/types';
import { RecordEntryExpressionAstNode } from '../../../ast/types/expressionNodes';
import { RecordEntryTypeAstNode } from '../../../ast/types/typeNodes';
import { CheckAstNode, AstCheckerContext } from '../../types';
import { AstCheckerTypeNames, AstCheckerType } from '../../types/types';
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
      name: AstCheckerTypeNames.Record,
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
