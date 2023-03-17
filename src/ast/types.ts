export enum AstNodeName {
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
type BaseNodeWithoutHasValue<TName extends AstNodeName> = {
  name: TName;
};
type BaseNode<TName extends AstNodeName> = BaseNodeWithoutHasValue<TName> & {
  hasValue: boolean;
};

export type BlockAstNode = BaseNode<AstNodeName.Block> & {
  children: AstNode[];
};
type StringAstNode = BaseNode<AstNodeName.String>;
type NumberAstNode = BaseNode<AstNodeName.Number>;
export type TupleAstNode = BaseNode<AstNodeName.Tuple> & {
  items: AstValueNode[];
};
type FunctionDeclarationAstNode = BaseNode<AstNodeName.FunctionDeclaration> & {
  parameters: TupleAstNode;
  return: AstValueNode;
};
type ParameterAstNode = BaseNodeWithoutHasValue<AstNodeName.Parameter> & {
  parameterName: string;
};
type FunctionCallAstNode = BaseNode<AstNodeName.FunctionCall> & {
  callee: AstValueNode;
  arguments: TupleAstNode;
};
type VariableReferenceAstNode =
  BaseNodeWithoutHasValue<AstNodeName.VariableReference> & {
    variableName: string;
  };
type GenericAstNode = BaseNode<AstNodeName.Generic> & {
  genericName: string;
};
export type AstValueNode =
  | BlockAstNode
  | StringAstNode
  | NumberAstNode
  | TupleAstNode
  | FunctionDeclarationAstNode
  | ParameterAstNode
  | FunctionCallAstNode
  | VariableReferenceAstNode
  | GenericAstNode;

export type VariableAssignmentAstNode =
  BaseNode<AstNodeName.VariableAssignment> & {
    variableName: string;
    implicitType?: AstValueNode;
    explicitType?: AstValueNode;
  };

// just for development
type InvalidAstNode = BaseNodeWithoutHasValue<AstNodeName.Invalid>;

export type AstNode = VariableAssignmentAstNode | AstValueNode | InvalidAstNode;
