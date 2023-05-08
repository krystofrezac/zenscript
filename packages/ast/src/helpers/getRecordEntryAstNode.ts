import { NonterminalNode } from 'ohm-js';
import { AstNode, AstNodeName } from '../types';
import { IdentifierTypeAstNode } from '../types/typeNodes';
import { createInvalidAstNode, createAstNode } from './createAstNode';
import { IdentifierExpressionAstNode } from '../types/expressionNodes';

type IdentifierNode = IdentifierExpressionAstNode | IdentifierTypeAstNode;

export const getRecordEntryAstNode =
  (
    nodeName:
      | AstNodeName.RecordEntryAccessType
      | AstNodeName.RecordEntryAccessExpression,
  ) =>
  (identifierList: NonterminalNode) => {
    const identifierNodes = identifierList.getAstNodes() as IdentifierNode[];

    const getType = ([head, ...tail]: IdentifierNode[]): AstNode => {
      if (!head) return createInvalidAstNode();
      if (tail.length === 0) return head;

      const accessing = getType(tail);

      return createAstNode({
        name: nodeName,
        entryName: head?.identifierName,
        // Tax for making this function generic
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        accessing,
      });
    };

    return getType(identifierNodes.reverse());
  };
