export enum CheckerTypeNames {
  Number = 'number',
  String = 'string',
  Empty = 'Empty',
}

type CheckerTypeBase<TName extends CheckerTypeNames> = {
  name: TName;
  hasValue: boolean;
};

type CheckerNumberType = CheckerTypeBase<CheckerTypeNames.Number>;
type CheckerStringType = CheckerTypeBase<CheckerTypeNames.String>;

type CheckerEmptyType = CheckerTypeBase<CheckerTypeNames.Empty> & {
  hasValue: false;
};

export type CheckerType =
  | CheckerNumberType
  | CheckerStringType
  | CheckerEmptyType;
