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
type VariableReferenceNOde = BaseNodeWithoutHasName<'variableReference'> & {
  identifierName: string;
};
export type TypeNode =
  | BlockTypeNode
  | StringTypeNode
  | NumberTypeNode
  | TupleTypeNode
  | VariableReferenceNOde;

type VariableAssignmentNode = BaseNode<'variableAssignment'> & {
  variableName: string;
  implicitTypeNode?: TypeNode;
  explicitTypeNode?: TypeNode;
};

// just for development
type InvalidNode = BaseNodeWithoutHasName<'invalid'>;

export type TypeTreeNode = VariableAssignmentNode | TypeNode | InvalidNode;
