import type {
  AstCheckerRecordType,
  AstCheckerType,
  AstCheckerTypeNames,
} from './types';

export enum AstCheckerErrorName {
  IdentifierAlreadyDeclaredInThisScope = 'IdentifierAlreadyDeclaredInThisScope',
  UnknownIdentifier = 'UnknownIdentifier',
  ExpressionWithoutValueUsedAsValue = 'ExpressionWithoutValueUsedAsValue',
  VariableTypeMismatch = 'VariableTypeMismatch',
  FunctionParametersMismatch = 'FunctionParametersMismatch',
  EmptyBlock = 'EmptyBlock',
  CallingNonCallableExpression = 'CallingNonCallableExpression',
  EntryDoesNotExistOnRecord = 'FieldDoesNotExistOnRecord',
  AccessingNonRecord = 'AccessingNonRecord',
  NestedExport = 'NestedExport',
}
type AstCheckerErrorBase<
  TName extends AstCheckerErrorName,
  TData extends Record<string, unknown> = Record<never, never>,
> = {
  name: TName;
  data: TData;
};
export type AstCheckerError =
  | AstCheckerErrorBase<
      AstCheckerErrorName.UnknownIdentifier,
      { identifier: string }
    >
  | AstCheckerErrorBase<
      AstCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
      { identifier: string }
    >
  | AstCheckerErrorBase<
      AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      {
        expressionType: AstCheckerType;
      }
    >
  | AstCheckerErrorBase<
      AstCheckerErrorName.VariableTypeMismatch,
      {
        variableName: string;
        expected: AstCheckerType;
        received: AstCheckerType;
      }
    >
  | AstCheckerErrorBase<
      AstCheckerErrorName.FunctionParametersMismatch,
      {
        expected: AstCheckerType[];
        received: AstCheckerType[];
      }
    >
  | AstCheckerErrorBase<AstCheckerErrorName.EmptyBlock>
  | AstCheckerErrorBase<
      AstCheckerErrorName.CallingNonCallableExpression,
      {
        callee: AstCheckerType;
      }
    >
  | AstCheckerErrorBase<
      AstCheckerErrorName.EntryDoesNotExistOnRecord,
      {
        record: AstCheckerRecordType;
        entryName: string;
      }
    >
  | AstCheckerErrorBase<
      AstCheckerErrorName.AccessingNonRecord,
      {
        accessing: AstCheckerTypeNames;
      }
    >
  | AstCheckerErrorBase<AstCheckerErrorName.NestedExport>;
