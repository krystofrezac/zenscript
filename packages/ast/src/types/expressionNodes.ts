import type { AstBaseNode, AstNodeName, BlockAstNode } from '.';

export type IdentifierExpressionAstNode =
  AstBaseNode<AstNodeName.IdentifierExpression> & {
    identifierName: string;
  };
export type ImportExpressionAstNode =
  AstBaseNode<AstNodeName.ImportExpression> & {
    parameters: ExpressionAstNode[];
  };
type StringExpressionAstNode = AstBaseNode<AstNodeName.StringExpression> & {
  value: string;
};
type NumberExpressionAstNode = AstBaseNode<AstNodeName.NumberExpression> & {
  value: number;
};
export type TupleExpressionAstNode =
  AstBaseNode<AstNodeName.TupleExpression> & {
    items: ExpressionAstNode[];
  };

type RecordExpressionAstNode = AstBaseNode<AstNodeName.RecordExpression> & {
  entries: RecordEntryExpressionAstNode[];
};
export type RecordEntryExpressionAstNode =
  AstBaseNode<AstNodeName.RecordEntryExpression> & {
    key: string;
    value: ExpressionAstNode;
  };
type RecordEntryAccessAstNode =
  AstBaseNode<AstNodeName.RecordEntryAccessExpression> & {
    entryName: string;
    accessing: ExpressionAstNode;
  };

type FunctionDeclarationExpressionAstNode =
  AstBaseNode<AstNodeName.FunctionDeclarationExpression> & {
    parameters: IdentifierExpressionAstNode[];
    return: ExpressionAstNode | BlockAstNode;
  };
type FunctionCallExpressionAstNode =
  AstBaseNode<AstNodeName.FunctionCallExpression> & {
    callee: ExpressionAstNode;
    arguments: ExpressionAstNode[];
  };

export type ExpressionAstNode =
  | ImportExpressionAstNode
  | IdentifierExpressionAstNode
  | StringExpressionAstNode
  | NumberExpressionAstNode
  | TupleExpressionAstNode
  | RecordExpressionAstNode
  | RecordEntryExpressionAstNode
  | RecordEntryAccessAstNode
  | FunctionDeclarationExpressionAstNode
  | FunctionCallExpressionAstNode;
