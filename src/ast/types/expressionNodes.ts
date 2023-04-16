import { AstBaseNode, AstNodeName, BlockAstNode } from '.';

export type IdentifierExpressionAstNode =
  AstBaseNode<AstNodeName.IdentifierExpression> & {
    identifierName: string;
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
    arguments: TupleExpressionAstNode;
  };

export type ExpressionAstNode =
  | IdentifierExpressionAstNode
  | StringExpressionAstNode
  | NumberExpressionAstNode
  | TupleExpressionAstNode
  | RecordExpressionAstNode
  | RecordEntryExpressionAstNode
  | RecordEntryAccessAstNode
  | FunctionDeclarationExpressionAstNode
  | FunctionCallExpressionAstNode;
