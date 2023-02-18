export enum CheckerTypeNames {
  Number = 'number',
  String = 'string',
  Empty = 'Empty',
}

type CheckerTypeBase<TName extends CheckerTypeNames> = {
  name: TName;
};

type CheckerNumberType = CheckerTypeBase<CheckerTypeNames.Number>;
type CheckerStringType = CheckerTypeBase<CheckerTypeNames.String>;

type CheckerEmptyType = CheckerTypeBase<CheckerTypeNames.Empty>;

export type CheckerType =
  | CheckerNumberType
  | CheckerStringType
  | CheckerEmptyType;
