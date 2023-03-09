export enum CheckerTypeNames {
  Number = 'number',
  String = 'string',
  Tuple = 'tuple',
  Function = 'function',

  FigureOut = 'FigureOut',
  Empty = 'Empty',
}

type CheckerTypeBase<TName extends CheckerTypeNames> = {
  name: TName;
  hasValue: boolean;
};

type CheckerNumberType = CheckerTypeBase<CheckerTypeNames.Number>;
type CheckerStringType = CheckerTypeBase<CheckerTypeNames.String>;

export type CheckerTupleType = CheckerTypeBase<CheckerTypeNames.Tuple> & {
  items: CheckerType[];
};

export type CheckerFunctionType = CheckerTypeBase<CheckerTypeNames.Function> & {
  parameters: CheckerTupleType;
  return: CheckerType;
};

type CheckerFigureOutType = CheckerTypeBase<CheckerTypeNames.FigureOut>;
type CheckerEmptyType = CheckerTypeBase<CheckerTypeNames.Empty>;

export type CheckerType =
  | CheckerNumberType
  | CheckerStringType
  | CheckerTupleType
  | CheckerFunctionType
  | CheckerEmptyType
  | CheckerFigureOutType;
