export type Type =
  | {
      type: 'string' | 'number' | 'unknown';
    }
  | {
      type: 'function';
      parameters: Type;
      returns: Type;
    }
  | {
      type: 'tuple';
      items: Type[];
    };

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
