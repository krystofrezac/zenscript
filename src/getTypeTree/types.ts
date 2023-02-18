export enum TypeTreeNodeName {
  Block = 'block',
  String = 'string',
  Number = 'number',
  Tuple = 'tuple',
  FunctionDeclaration = 'functionDeclaration',
  Parameter = 'parameter',
  FunctionCall = 'functionCall',
  VariableReference = 'variableReference',
  Generic = 'generic',
  VariableAssignment = 'variableAssignment',
  Invalid = 'invalid',
}
type BaseNodeWithoutHasName<TName extends TypeTreeNodeName> = {
  name: TName;
};
type BaseNode<TName extends TypeTreeNodeName> =
  BaseNodeWithoutHasName<TName> & {
    hasValue: boolean;
  };

export type BlockTypeNode = BaseNode<TypeTreeNodeName.Block> & {
  children: TypeTreeNode[];
};
type StringTypeNode = BaseNode<TypeTreeNodeName.String>;
type NumberTypeNode = BaseNode<TypeTreeNodeName.Number>;
type TupleTypeNode = BaseNode<TypeTreeNodeName.Tuple> & {
  items: TypeNode[];
};
type FunctionDeclarationTypeNode =
  BaseNode<TypeTreeNodeName.FunctionDeclaration> & {
    parameters: TupleTypeNode;
    return: TypeNode;
  };
type ParameterTypeNode = BaseNodeWithoutHasName<TypeTreeNodeName.Parameter> & {
  parameterName: string;
};
type FunctionCallTypeNode = BaseNode<TypeTreeNodeName.FunctionCall> & {
  callee: TypeNode;
  arguments: TupleTypeNode;
};
type VariableReferenceTypeNode =
  BaseNodeWithoutHasName<TypeTreeNodeName.VariableReference> & {
    variableName: string;
  };
type GenericTypeNode = BaseNode<TypeTreeNodeName.Generic> & {
  genericName: string;
};
export type TypeNode =
  | BlockTypeNode
  | StringTypeNode
  | NumberTypeNode
  | TupleTypeNode
  | FunctionDeclarationTypeNode
  | ParameterTypeNode
  | FunctionCallTypeNode
  | VariableReferenceTypeNode
  | GenericTypeNode;

type VariableAssignmentNode = BaseNode<TypeTreeNodeName.VariableAssignment> & {
  variableName: string;
  implicitTypeNode?: TypeNode;
  explicitTypeNode?: TypeNode;
};

// just for development
type InvalidNode = BaseNodeWithoutHasName<TypeTreeNodeName.Invalid>;

export type TypeTreeNode = VariableAssignmentNode | TypeNode | InvalidNode;
