import { CheckerType } from './types';

export enum TypeTreeCheckerErrorName {
  IdentifierAlreadyDeclaredInThisScope = 'IdentifierAlreadyDeclaredInThisScope',
  UnknownIdentifier = 'UnknownIdentifier',
  ExpressionWithoutValueUsedAsValue = 'VariableWithoutValueUsedAsValue',
}
type TypeTreeCheckerErrorBase<
  TName extends TypeTreeCheckerErrorName,
  TData extends Record<string, unknown> = Record<never, never>,
> = {
  name: TName;
  data: TData;
};
export type TypeTreeCheckerError =
  | TypeTreeCheckerErrorBase<
      TypeTreeCheckerErrorName.UnknownIdentifier,
      { identifier: string }
    >
  | TypeTreeCheckerErrorBase<
      TypeTreeCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
      { identifier: string }
    >
  | TypeTreeCheckerErrorBase<
      TypeTreeCheckerErrorName.ExpressionWithoutValueUsedAsValue,
      {
        expressionType: CheckerType;
      }
    >;
