export enum AstCheckerTypeNames {
  Atom = 'Atom',
  AtomUnion = 'AtomUnion',
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

type AstCheckerAtomType = AstCheckerTypeBase<AstCheckerTypeNames.Atom> & {
  atomName: string;
  arguments: AstCheckerType[];
};
type AstCheckerAtomUnionType =
  AstCheckerTypeBase<AstCheckerTypeNames.AtomUnion> & {
    atoms: AstCheckerAtomType[];
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
    parameters: AstCheckerType[];
    return: AstCheckerType;
  };

type AstCheckerEmptyType = AstCheckerTypeBase<AstCheckerTypeNames.Empty>;

type AstCheckerFigureOutType =
  AstCheckerTypeBase<AstCheckerTypeNames.FigureOut> & {
    id: number;
  };
type AstCheckerIgnoreType = AstCheckerTypeBase<AstCheckerTypeNames.Ignore>;

export type AstCheckerType =
  | AstCheckerAtomType
  | AstCheckerAtomUnionType
  | AstCheckerNumberType
  | AstCheckerStringType
  | AstCheckerTupleType
  | AstCheckerRecordType
  | AstCheckerFunctionType
  | AstCheckerEmptyType
  | AstCheckerFigureOutType
  | AstCheckerIgnoreType;
