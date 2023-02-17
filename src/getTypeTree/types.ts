type BaseNodeWithoutHasName<TName> = {
  name: TName;
};
type BaseNode<TName> = BaseNodeWithoutHasName<TName> & {
  hasValue: boolean;
};

type BlockTypeNode = BaseNode<'block'> & {
  children: TypeTreeNode[];
};
type StringTypeNode = BaseNode<'string'>;
type NumberTypeNode = BaseNode<'number'>;
type TupleTypeNode = BaseNode<'tuple'> & {
  items: TypeNode[];
};
type FunctionTypeNode = BaseNode<'function'> & {
  parameters: TupleTypeNode;
  return: TypeNode;
};
type ParameterTypeNode = BaseNodeWithoutHasName<'parameter'> & {
  parameterName: string;
};
type VariableReferenceNode = BaseNodeWithoutHasName<'variableReference'> & {
  variableName: string;
};
type GenericTypeNode = BaseNode<'generic'> & {
  genericName: string;
};
export type TypeNode =
  | BlockTypeNode
  | StringTypeNode
  | NumberTypeNode
  | TupleTypeNode
  | FunctionTypeNode
  | ParameterTypeNode
  | VariableReferenceNode
  | GenericTypeNode;

type VariableAssignmentNode = BaseNode<'variableAssignment'> & {
  variableName: string;
  implicitTypeNode?: TypeNode;
  explicitTypeNode?: TypeNode;
};

// just for development
type InvalidNode = BaseNodeWithoutHasName<'invalid'>;

export type TypeTreeNode = VariableAssignmentNode | TypeNode | InvalidNode;
