import type { ExpressionAstNode } from './expressionNodes';
import type { TypeAstNode } from './typeNodes';

export enum AstNodeName {
  IdentifierExpression = 'VariableReferenceExpression',
  IdentifierType = 'VariableReferenceType',

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

  Block = 'Block',
  VariableAssignment = 'VariableAssignment',
  Invalid = 'Invalid',
}

export type AstBaseNode<TName extends AstNodeName> = {
  name: TName;
};

export type BlockAstNode = AstBaseNode<AstNodeName.Block> & {
  children: (CommonAstNode | ExpressionAstNode)[];
};
type VariableAssignmentAstNode = AstBaseNode<AstNodeName.VariableAssignment> & {
  identifierName: string;
  type?: TypeAstNode;
  expression?: ExpressionAstNode | BlockAstNode;
};
type InvalidAstNode = AstBaseNode<AstNodeName.Invalid>;

export type CommonAstNode =
  | BlockAstNode
  | VariableAssignmentAstNode
  | InvalidAstNode;

export type AstNode = CommonAstNode | ExpressionAstNode | TypeAstNode;
