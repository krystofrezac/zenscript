type BaseType<Type extends string> = { type: Type };

type StringType = BaseType<'string'>;
type NumberType = BaseType<'number'>;
type BooleanType = BaseType<'boolean'>;
type UnknownType = BaseType<'unknown'>;
type FigureOutType = BaseType<'figureOut'>;
export type TupleType = BaseType<'tuple'> & {
  items: Type[];
};
type FunctionType = BaseType<'function'> & {
  parameters: TupleType;
  returns: Type;
};
export type Type =
  | StringType
  | NumberType
  | BooleanType
  | UnknownType
  | FigureOutType
  | TupleType
  | FunctionType;

export type Variable = {
  name: string;
  type: Type;
  hasValue: boolean;
};
export type TypeScope = {
  variables: Variable[];
};
export type Error = {
  message: string;
};

export type CheckerContext = {
  typeScopes: TypeScope[];
  errors: Error[];
};
