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

type AstCheckerNumberType = CheckerTypeBase<CheckerTypeNames.Number>;
type AstCheckerStringType = CheckerTypeBase<CheckerTypeNames.String>;

export type AstCheckerTupleType = CheckerTypeBase<CheckerTypeNames.Tuple> & {
  items: AstCheckerType[];
};

export type AstCheckerFunctionType =
  CheckerTypeBase<CheckerTypeNames.Function> & {
    parameters: AstCheckerTupleType;
    return: AstCheckerType;
  };

type AstCheckerFigureOutType = CheckerTypeBase<CheckerTypeNames.FigureOut> & {
  id: number;
};
type AstCheckerEmptyType = CheckerTypeBase<CheckerTypeNames.Empty>;

export type AstCheckerType =
  | AstCheckerNumberType
  | AstCheckerStringType
  | AstCheckerTupleType
  | AstCheckerFunctionType
  | AstCheckerEmptyType
  | AstCheckerFigureOutType;
