import type { AstBaseNode, AstNodeName } from '.';

export type IdentifierTypeAstNode = AstBaseNode<AstNodeName.IdentifierType> & {
  identifierName: string;
};
type AtomTypeAstNode = AstBaseNode<AstNodeName.AtomType> & {
  atomName: string;
  arguments: TypeAstNode[];
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
  arguments: TypeAstNode[];
};

export type TypeAstNode =
  | IdentifierTypeAstNode
  | AtomTypeAstNode
  | StringTypeAstNode
  | NumberTypeAstNode
  | TupleTypeAstNode
  | RecordTypeAstNode
  | RecordEntryTypeAstNode
  | RecordEntryAccessAstNode
  | FunctionDeclarationTypeAstNode
  | FunctionCallTypeAstNode;
