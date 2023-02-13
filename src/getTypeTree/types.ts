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
export type TypeNode = BlockTypeNode | StringTypeNode | NumberTypeNode;

type VariableAssignmentNode = BaseNode<'variableAssignment'> & {
  variableName: string;
  implicitTypeNode?: TypeNode;
  explicitTypeNode?: TypeNode;
};

// just for development
type InvalidNode = BaseNodeWithoutHasName<'invalid'>;

export type TypeTreeNode = VariableAssignmentNode | TypeNode | InvalidNode;
