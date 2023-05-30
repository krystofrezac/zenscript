import type { ExpressionAstNode } from './expressionNodes';
import type { TypeAstNode } from './typeNodes';

export enum AstNodeName {
  IdentifierExpression = 'VariableReferenceExpression',
  IdentifierType = 'VariableReferenceType',

  ImportExpression = 'ImportExpression',

  StringExpression = 'StringExpression',
  StringType = 'StringType',

  NumberExpression = 'NumberExpression',
  NumberType = 'NumberType',

  TupleExpression = 'TupleExpression',
  TupleType = 'TupleType',

  RecordExpression = 'RecordExpression',
  RecordType = 'RecordType',

  RecordEntryExpression = 'RecordEntryExpression',
  RecordEntryType = 'RecordEntryType',

  RecordEntryAccessExpression = 'RecordEntryAccessExpression',
  RecordEntryAccessType = 'RecordEntryAccessType',

  FunctionDeclarationExpression = 'FunctionDeclarationExpression',
  FunctionDeclarationType = 'FunctionDeclarationType',

  FunctionCallExpression = 'FunctionCallExpression ',
  FunctionCallType = 'FunctionCallType ',

  File = 'File',
  Block = 'Block',
  VariableAssignment = 'VariableAssignment',
  ExportedVariableAssignment = 'ExportedVariableAssignment',
  Invalid = 'Invalid',
}

export type AstBaseNode<TName extends AstNodeName> = {
  name: TName;
};

export type FileAstNode = AstBaseNode<AstNodeName.File> & {
  children: (CommonAstNode | ExpressionAstNode)[];
};
export type BlockAstNode = AstBaseNode<AstNodeName.Block> & {
  children: (CommonAstNode | ExpressionAstNode)[];
};
export type VariableAssignmentAstNode =
  AstBaseNode<AstNodeName.VariableAssignment> & {
    identifierName: string;
    type?: TypeAstNode;
    expression?: ExpressionAstNode | BlockAstNode;
  };
type ExportedVariableAssignmentAstNode =
  AstBaseNode<AstNodeName.ExportedVariableAssignment> & {
    variableAssignment: VariableAssignmentAstNode;
  };
type InvalidAstNode = AstBaseNode<AstNodeName.Invalid>;

export type CommonAstNode =
  | FileAstNode
  | BlockAstNode
  | VariableAssignmentAstNode
  | ExportedVariableAssignmentAstNode
  | InvalidAstNode;

export type AstNode = CommonAstNode | ExpressionAstNode | TypeAstNode;
