export enum AstCheckerTypeNames {
  Number = 'number',
  String = 'string',
  Tuple = 'tuple',
  Record = 'record',
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
export type AstCheckerRecordType =
  AstCheckerTypeBase<AstCheckerTypeNames.Record> & {
    entries: Record<string, AstCheckerType>;
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
  | AstCheckerRecordType
  | AstCheckerFunctionType
  | AstCheckerEmptyType
  | AstCheckerFigureOutType
  | AstCheckerIgnoreType;
