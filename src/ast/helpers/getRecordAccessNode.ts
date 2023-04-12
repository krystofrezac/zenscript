import { NonterminalNode } from 'ohm-js';
import { VariableReferenceAstNode, AstNode, AstNodeName } from '../types';
import { createInvalidAstNode, createAstNode } from './createAstNode';
import { isAstValueNode } from './isAstValueNode';

export const getRecordAccessNode =
  (hasValue: boolean) => (identifierList: NonterminalNode) => {
    const identifierNodes =
      identifierList.getAstNodes() as VariableReferenceAstNode[];

    const getType = ([head, ...tail]: VariableReferenceAstNode[]): AstNode => {
      if (!head) return createInvalidAstNode();
      if (tail.length === 0) return head;

      const accessing = getType(tail);
      if (!isAstValueNode(accessing)) return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.RecordEntryAccess,
        entryName: head?.variableName,
        accessing,
        hasValue,
      });
    };

    return getType(identifierNodes.reverse());
  };
