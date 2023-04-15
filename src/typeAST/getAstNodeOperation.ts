import ohm from 'ohm-js';
import { BoringLangSemantics } from '../grammar.ohm-bundle';
import { createInvalidAstNode, createAstNode } from './helpers/createAstNode';
import { getTupleItemsTypes } from './helpers/getTupleItemsTypes';
import { isAstValueNode } from './helpers/isAstValueNode';
import { AstValueNode, AstNodeName, RecordEntryAstNode } from './types';
import { getRecordAccessNode } from './helpers/getRecordAccessNode';

export const getAstNodeOperation = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['getAstNode']>>('getAstNode', {
    NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) =>
      createAstNode({
        name: AstNodeName.Block,
        children: [firstItem.getAstNode(), ...tailIterable.getAstNodes()],
        hasValue: true,
      }),
    EmptyListOf: () =>
      createAstNode({
        name: AstNodeName.Block,
        children: [],
        hasValue: true,
      }),

    // expressions
    stringExpression: (_startQuotes, _content, _endQuotes) =>
      createAstNode({ name: AstNodeName.String, hasValue: true }),
    numberExpression: _content =>
      createAstNode({ name: AstNodeName.Number, hasValue: true }),
    Block: (_startCurly, content, _endCurly) =>
      createAstNode({
        name: AstNodeName.Block,
        children: content.getAstNodes(),
        hasValue: true,
      }),
    TupleExpression: (_startBracket, items, _endBracket) => {
      const itemsTypes = getTupleItemsTypes(items);

      return createAstNode({
        name: AstNodeName.Tuple,
        items: itemsTypes,
        hasValue: true,
      });
    },
    RecordExpression: (_start, content, _end) => {
      const entries = content.getAstNodes() as RecordEntryAstNode[];

      return createAstNode({
        name: AstNodeName.Record,
        entries,
        hasValue: true,
      });
    },
    RecordEntryAccessExpression: getRecordAccessNode(true),
    FunctionParameter: name =>
      createAstNode({
        name: AstNodeName.Parameter,
        parameterName: name.getName(),
        hasValue: true,
      }),
    FunctionValueDeclaration: (
      _startBracket,
      parameters,
      _endBracket,
      returnExpression,
    ) => {
      const parametersTypes = parameters.getAstNodes();
      const returnType = returnExpression.getAstNode();

      if (
        parametersTypes.some(parameterType => !isAstValueNode(parameterType)) ||
        !isAstValueNode(returnType)
      )
        return createInvalidAstNode();

      const parametersTupleType = createAstNode({
        name: AstNodeName.Tuple,
        items: parametersTypes as AstValueNode[], // checked above
        hasValue: true,
      });

      return createAstNode({
        name: AstNodeName.FunctionDeclaration,
        parameters: parametersTupleType,
        return: returnType,
        hasValue: true,
      });
    },
    FunctionValueCall: (callee, argumentsExpression) => {
      const calleeType = callee.getAstNode();
      const argumentsType = argumentsExpression.getAstNode();
      if (
        !isAstValueNode(calleeType) ||
        argumentsType.name !== AstNodeName.Tuple
      )
        return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.FunctionCall,
        callee: calleeType,
        arguments: argumentsType,
        hasValue: true,
      });
    },

    // types
    stringType: _content =>
      createAstNode({ name: AstNodeName.String, hasValue: false }),
    numberType: _content =>
      createAstNode({ name: AstNodeName.Number, hasValue: false }),
    TupleType: (_startBracket, items, _endBracket) => {
      const itemsTypes = getTupleItemsTypes(items);

      return createAstNode({
        name: AstNodeName.Tuple,
        items: itemsTypes,
        hasValue: false,
      });
    },
    RecordType: (_start, content, _end) => {
      const entries = content.getAstNodes() as RecordEntryAstNode[];

      return createAstNode({
        name: AstNodeName.Record,
        entries,
        hasValue: false,
      });
    },
    RecordEntryAccessType: getRecordAccessNode(false),

    FunctionTypeDeclaration: (parametersTuple, returnExpression) => {
      const parametersType = parametersTuple.getAstNode();
      const returnType = returnExpression.getAstNode();
      if (
        parametersType.name !== AstNodeName.Tuple ||
        !isAstValueNode(returnType)
      )
        return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.FunctionDeclaration,
        parameters: parametersType,
        return: returnType,
        hasValue: false,
      });
    },
    genericName: (_apostrophe, name) =>
      createAstNode({
        name: AstNodeName.Generic,
        genericName: name.getName(),
        hasValue: false,
      }),
    FunctionTypeCall: (callee, argumentsTuple) => {
      const calleeType = callee.getAstNode();
      const argumentsType = argumentsTuple.getAstNode();
      if (
        !isAstValueNode(calleeType) ||
        argumentsType.name !== AstNodeName.Tuple
      )
        return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.FunctionCall,
        callee: calleeType,
        arguments: argumentsType,
        hasValue: false,
      });
    },

    // expressions and types
    identifier: identifier =>
      createAstNode({
        name: AstNodeName.VariableReference,
        variableName: identifier.sourceString,
      }),
    RecordEntry: (identifier, _colon, value) => {
      const valueAst = value.getAstNode();

      if (!isAstValueNode(valueAst)) return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.RecordEntry,
        key: identifier.getName(),
        value: valueAst,
        hasValue: 'hasValue' in valueAst ? valueAst.hasValue : false,
      });
    },

    // variable assignments
    VariableDeclaration_onlyValue: (identifier, valueAssignment) => {
      const valueType = valueAssignment.getAstNode();
      if (!isAstValueNode(valueType)) return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.VariableAssignment,
        variableName: identifier.getName(),
        implicitType: valueType,
        hasValue: true,
      });
    },
    VariableDeclaration_valueAndType: (
      identifier,
      typeAssignment,
      valueAssignment,
    ) => {
      const typeAssignmentType = typeAssignment.getAstNode();
      const valueAssignmentType = valueAssignment.getAstNode();

      if (
        !isAstValueNode(typeAssignmentType) ||
        !isAstValueNode(valueAssignmentType)
      )
        return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.VariableAssignment,
        variableName: identifier.getName(),
        explicitType: typeAssignmentType,
        implicitType: valueAssignmentType,
        hasValue: true,
      });
    },
    VariableDeclaration_onlyType: (identifier, typeAssignment) => {
      const typeAssignmentType = typeAssignment.getAstNode();

      if (!isAstValueNode(typeAssignmentType)) return createInvalidAstNode();

      return createAstNode({
        name: AstNodeName.VariableAssignment,
        variableName: identifier.getName(),
        explicitType: typeAssignmentType,
        hasValue: false,
      });
    },
    ValueAssignment: (_assignmentOperator, value) => value.getAstNode(),
    TypeAssignment: (_typeOperator, value) => value.getAstNode(),
  });
