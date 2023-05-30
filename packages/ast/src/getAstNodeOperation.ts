import type ohm from 'ohm-js';
import type { BoringLangSemantics } from './grammar.ohm-bundle';
import { createAstNode } from './helpers/createAstNode';
import type { CommonAstNode } from './types';
import { AstNodeName } from './types';
import type {
  ExpressionAstNode,
  IdentifierExpressionAstNode,
  RecordEntryExpressionAstNode,
  TupleExpressionAstNode,
} from './types/expressionNodes';
import type {
  RecordEntryTypeAstNode,
  TupleTypeAstNode,
  TypeAstNode,
} from './types/typeNodes';
import { getRecordEntryAstNode } from './helpers/getRecordEntryAstNode';

export const getAstNodeOperation = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['getAstNode']>>('getAstNode', {
    NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) => {
      const firstItemNode = firstItem.getAstNode() as
        | CommonAstNode
        | ExpressionAstNode;
      const tailNodes = tailIterable.getAstNodes() as (
        | CommonAstNode
        | ExpressionAstNode
      )[];

      return createAstNode({
        name: AstNodeName.Block,
        children: [firstItemNode, ...tailNodes],
      });
    },
    EmptyListOf: () =>
      createAstNode({
        name: AstNodeName.Block,
        children: [],
      }),

    File: content =>
      createAstNode({
        name: AstNodeName.File,
        children: content.getAstNodes(),
      }),
    Block: (_startCurly, content, _endCurly) =>
      createAstNode({
        name: AstNodeName.Block,
        children: content.getAstNodes() as (
          | CommonAstNode
          | ExpressionAstNode
        )[],
      }),

    VariableDeclaration_onlyExpression: (identifier, expressionAssignment) =>
      createAstNode({
        name: AstNodeName.VariableAssignment,
        identifierName: identifier.getName(),
        expression: expressionAssignment.getAstNode() as ExpressionAstNode,
      }),
    VariableDeclaration_onlyType: (identifier, typeAssignment) =>
      createAstNode({
        name: AstNodeName.VariableAssignment,
        identifierName: identifier.getName(),
        type: typeAssignment.getAstNode() as TypeAstNode,
      }),
    VariableDeclaration_expressionAndType: (
      identifier,
      typeAssignment,
      expressionAssignment,
    ) =>
      createAstNode({
        name: AstNodeName.VariableAssignment,
        identifierName: identifier.getName(),
        type: typeAssignment.getAstNode() as TypeAstNode,
        expression: expressionAssignment.getAstNode() as ExpressionAstNode,
      }),
    TypeAssignment: (_operator, typeNode) => typeNode.getAstNode(),
    ExpressionAssignment: (_operator, typeNode) => typeNode.getAstNode(),
    ExportedVariable: (_exportKeyword, variableNode) =>
      createAstNode({
        name: AstNodeName.ExportedVariableAssignment,
        variableAssignment: variableNode.getAstNode(),
      }),

    // expressions
    identifierExpression: name =>
      createAstNode({
        name: AstNodeName.IdentifierExpression,
        identifierName: name.getName(),
      }),
    ImportStatementExpression: (_import, parameters) =>
      createAstNode({
        name: AstNodeName.ImportExpression,
        parameters: (parameters.getAstNode() as TupleExpressionAstNode).items,
      }),
    stringExpression: (_startQuotes, content, _endQuotes) =>
      createAstNode({
        name: AstNodeName.StringExpression,
        value: content.sourceString,
      }),
    numberExpression: content =>
      createAstNode({
        name: AstNodeName.NumberExpression,
        value: +content.sourceString,
      }),
    TupleExpression: (_startBracket, items, _endBracket) =>
      createAstNode({
        name: AstNodeName.TupleExpression,
        items: items.getAstNodes() as ExpressionAstNode[],
      }),

    FunctionDeclarationExpression: (
      _startBracket,
      parameters,
      _endBracket,
      returnExpression,
    ) =>
      createAstNode({
        name: AstNodeName.FunctionDeclarationExpression,
        parameters: parameters.getAstNodes() as IdentifierExpressionAstNode[],
        return: returnExpression.getAstNode() as ExpressionAstNode,
      }),
    FunctionCallExpression: (callee, argumentsNode) =>
      createAstNode({
        name: AstNodeName.FunctionCallExpression,
        arguments: (argumentsNode.getAstNode() as TupleExpressionAstNode).items,
        callee: callee.getAstNode() as ExpressionAstNode,
      }),

    RecordExpression: (_start, content, _end) => {
      const entries = content.getAstNodes() as RecordEntryExpressionAstNode[];

      return createAstNode({
        name: AstNodeName.RecordExpression,
        entries,
      });
    },
    RecordEntryExpression: (key, _colon, value) =>
      createAstNode({
        name: AstNodeName.RecordEntryExpression,
        key: key.getName(),
        value: value.getAstNode() as ExpressionAstNode,
      }),
    RecordEntryAccessExpression: getRecordEntryAstNode(
      AstNodeName.RecordEntryAccessExpression,
    ),

    // types
    identifierType: name =>
      createAstNode({
        name: AstNodeName.IdentifierType,
        identifierName: name.getName(),
      }),
    ImportStatementType: (_import, parameters) =>
      createAstNode({
        name: AstNodeName.ImportType,
        parameters: (parameters.getAstNode() as TupleTypeAstNode).items,
      }),
    stringType: _string => createAstNode({ name: AstNodeName.StringType }),
    numberType: _string => createAstNode({ name: AstNodeName.NumberType }),
    TupleType: (_startBracket, items, _endBracket) =>
      createAstNode({
        name: AstNodeName.TupleType,
        items: items.getAstNodes() as TypeAstNode[],
      }),

    FunctionDeclarationType: (parametersTuple, returnExpression) => {
      const parametersTupleNode =
        parametersTuple.getAstNode() as TupleTypeAstNode;
      return createAstNode({
        name: AstNodeName.FunctionDeclarationType,
        parameters: parametersTupleNode.items,
        return: returnExpression.getAstNode() as TypeAstNode,
      });
    },
    FunctionCallType: (callee, argumentsNode) =>
      createAstNode({
        name: AstNodeName.FunctionCallType,
        arguments: (argumentsNode.getAstNode() as TupleTypeAstNode).items,
        callee: callee.getAstNode() as TypeAstNode,
      }),

    RecordType: (_start, content, _end) => {
      const entries = content.getAstNodes() as RecordEntryTypeAstNode[];

      return createAstNode({
        name: AstNodeName.RecordType,
        entries,
      });
    },
    RecordEntryType: (key, _colon, value) =>
      createAstNode({
        name: AstNodeName.RecordEntryType,
        key: key.getName(),
        value: value.getAstNode() as TypeAstNode,
      }),
    RecordEntryAccessType: getRecordEntryAstNode(
      AstNodeName.RecordEntryAccessType,
    ),
  });
