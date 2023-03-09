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
type BaseNodeWithoutHasValue<TName extends TypeTreeNodeName> = {
  name: TName;
};
type BaseNode<TName extends TypeTreeNodeName> =
  BaseNodeWithoutHasValue<TName> & {
    hasValue: boolean;
  };

export type BlockTypeNode = BaseNode<TypeTreeNodeName.Block> & {
  children: TypeTreeNode[];
};
type StringTypeNode = BaseNode<TypeTreeNodeName.String>;
type NumberTypeNode = BaseNode<TypeTreeNodeName.Number>;
export type TupleTypeNode = BaseNode<TypeTreeNodeName.Tuple> & {
  items: TypeNode[];
};
type FunctionDeclarationTypeNode =
  BaseNode<TypeTreeNodeName.FunctionDeclaration> & {
    parameters: TupleTypeNode;
    return: TypeNode;
  };
type ParameterTypeNode = BaseNodeWithoutHasValue<TypeTreeNodeName.Parameter> & {
  parameterName: string;
};
type FunctionCallTypeNode = BaseNode<TypeTreeNodeName.FunctionCall> & {
  callee: TypeNode;
  arguments: TupleTypeNode;
};
type VariableReferenceTypeNode =
  BaseNodeWithoutHasValue<TypeTreeNodeName.VariableReference> & {
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

export type VariableAssignmentNode =
  BaseNode<TypeTreeNodeName.VariableAssignment> & {
    variableName: string;
    implicitTypeNode?: TypeNode;
    explicitTypeNode?: TypeNode;
  };

// just for development
type InvalidNode = BaseNodeWithoutHasValue<TypeTreeNodeName.Invalid>;

export type TypeTreeNode = VariableAssignmentNode | TypeNode | InvalidNode;
