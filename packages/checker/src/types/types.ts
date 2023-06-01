export enum AstCheckerTypeName {
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

type AstCheckerTypeBase<TName extends AstCheckerTypeName> = {
  name: TName;
  hasValue: boolean;
};

export type AstCheckerAtomType = AstCheckerTypeBase<AstCheckerTypeName.Atom> & {
  atomName: string;
  arguments: AstCheckerType[];
};
type AstCheckerAtomUnionType =
  AstCheckerTypeBase<AstCheckerTypeName.AtomUnion> & {
    atoms: AstCheckerAtomType[];
  };

type AstCheckerNumberType = AstCheckerTypeBase<AstCheckerTypeName.Number>;
type AstCheckerStringType = AstCheckerTypeBase<AstCheckerTypeName.String>;

export type AstCheckerTupleType =
  AstCheckerTypeBase<AstCheckerTypeName.Tuple> & {
    items: AstCheckerType[];
  };
export type AstCheckerRecordType =
  AstCheckerTypeBase<AstCheckerTypeName.Record> & {
    entries: Record<string, AstCheckerType>;
  };

export type AstCheckerFunctionType =
  AstCheckerTypeBase<AstCheckerTypeName.Function> & {
    parameters: AstCheckerType[];
    return: AstCheckerType;
  };

type AstCheckerEmptyType = AstCheckerTypeBase<AstCheckerTypeName.Empty>;

type AstCheckerFigureOutType =
  AstCheckerTypeBase<AstCheckerTypeName.FigureOut> & {
    id: number;
  };
type AstCheckerIgnoreType = AstCheckerTypeBase<AstCheckerTypeName.Ignore>;

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
