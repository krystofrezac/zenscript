type BaseType<Type extends string> = { type: Type };

type StringType = BaseType<'string'>;
type NumberType = BaseType<'number'>;
type BooleanType = BaseType<'boolean'>;
type UnknownType = BaseType<'unknown'>;
export type FigureOutType = BaseType<'figureOut'> & {
  defaultType: Type;
};
export type TupleType = BaseType<'tuple'> & {
  items: Type[];
};
export type FunctionType = BaseType<'function'> & {
  parameters: TupleType;
  returns: Type;
};
export type GenericType = BaseType<'generic'> & {
  id: number;
};
export type NamedGenericType = BaseType<'namedGeneric'> & {
  id: number;
  name: string;
};
export type Type =
  | StringType
  | NumberType
  | BooleanType
  | UnknownType
  | FigureOutType
  | TupleType
  | FunctionType
  | GenericType
  | NamedGenericType;

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
  genericIdCounter: number;
};
