import { AstBaseNode, AstNodeName } from '.';

export type IdentifierTypeAstNode = AstBaseNode<AstNodeName.IdentifierType> & {
  identifierName: string;
};
type StringTypeAstNode = AstBaseNode<AstNodeName.StringType>;
type NumberTypeAstNode = AstBaseNode<AstNodeName.NumberType>;
export type TupleTypeAstNode = AstBaseNode<AstNodeName.TupleType> & {
  items: TypeAstNode[];
};

export type RecordTypeAstNode = AstBaseNode<AstNodeName.RecordType> & {
  entries: RecordEntryTypeAstNode[];
};
export type RecordEntryTypeAstNode =
  AstBaseNode<AstNodeName.RecordEntryType> & {
    key: string;
    value: TypeAstNode;
  };
type RecordEntryAccessAstNode =
  AstBaseNode<AstNodeName.RecordEntryAccessType> & {
    entryName: string;
    accessing: TypeAstNode;
  };

type FunctionDeclarationTypeAstNode =
  AstBaseNode<AstNodeName.FunctionDeclarationType> & {
    parameters: TypeAstNode[];
    return: TypeAstNode;
  };
type FunctionCallTypeAstNode = AstBaseNode<AstNodeName.FunctionCallType> & {
  callee: TypeAstNode;
  arguments: TupleTypeAstNode;
};

export type TypeAstNode =
  | IdentifierTypeAstNode
  | StringTypeAstNode
  | NumberTypeAstNode
  | TupleTypeAstNode
  | RecordTypeAstNode
  | RecordEntryTypeAstNode
  | RecordEntryAccessAstNode
  | FunctionDeclarationTypeAstNode
  | FunctionCallTypeAstNode;
