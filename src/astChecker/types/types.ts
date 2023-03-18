export enum AstCheckerTypeNames {
  Number = 'number',
  String = 'string',
  Tuple = 'tuple',
  Function = 'function',
  Empty = 'Empty',

  FigureOut = 'FigureOut',
  Ignore = 'Ignore',
}

type AstCheckerTypeBase<TName extends AstCheckerTypeNames> = {
  name: TName;
  hasValue: boolean;
};

type AstCheckerNumberType = AstCheckerTypeBase<AstCheckerTypeNames.Number>;
type AstCheckerStringType = AstCheckerTypeBase<AstCheckerTypeNames.String>;

export type AstCheckerTupleType =
  AstCheckerTypeBase<AstCheckerTypeNames.Tuple> & {
    items: AstCheckerType[];
  };

export type AstCheckerFunctionType =
  AstCheckerTypeBase<AstCheckerTypeNames.Function> & {
    parameters: AstCheckerTupleType;
    return: AstCheckerType;
  };

type AstCheckerEmptyType = AstCheckerTypeBase<AstCheckerTypeNames.Empty>;

type AstCheckerFigureOutType =
  AstCheckerTypeBase<AstCheckerTypeNames.FigureOut> & {
    id: number;
  };
type AstCheckerIgnoreType = AstCheckerTypeBase<AstCheckerTypeNames.Ignore>;

export type AstCheckerType =
  | AstCheckerNumberType
  | AstCheckerStringType
  | AstCheckerTupleType
  | AstCheckerFunctionType
  | AstCheckerEmptyType
  | AstCheckerFigureOutType
  | AstCheckerIgnoreType;
