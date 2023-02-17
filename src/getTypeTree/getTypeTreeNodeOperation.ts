import ohm from 'ohm-js';
import { BoringLangSemantics } from '../grammar.ohm-bundle';
import {
  createInvalidTreeNode,
  createTypeTreeNode,
} from './helpers/createTypeTreeNode';
import { getTupleItemsTypes } from './helpers/getTupleItemsTypes';
import { isTypeNode } from './helpers/isTypeNode';
import { TypeNode } from './types';

export const createGetTypeTreeNodeOperation = (
  semantics: BoringLangSemantics,
) =>
  semantics.addOperation<ReturnType<ohm.Node['getTypeTreeNode']>>(
    'getTypeTreeNode',
    {
      NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) =>
        createTypeTreeNode({
          name: 'block',
          children: [
            firstItem.getTypeTreeNode(),
            ...tailIterable.getTypeTreeNodes(),
          ],
          hasValue: true,
        }),
      EmptyListOf: () =>
        createTypeTreeNode({ name: 'block', children: [], hasValue: true }),

      // expressions
      stringExpression: (_startQuotes, _content, _endQuotes) =>
        createTypeTreeNode({ name: 'string', hasValue: true }),
      numberExpression: _content =>
        createTypeTreeNode({ name: 'number', hasValue: true }),
      Block: (_startCurly, content, _endCurly) =>
        createTypeTreeNode({
          name: 'block',
          children: content.getTypeTreeNodes(),
          hasValue: true,
        }),
      TupleExpression: (_startBracket, items, _endBracket) => {
        const itemsTypes = getTupleItemsTypes(items);

        return createTypeTreeNode({
          name: 'tuple',
          items: itemsTypes,
          hasValue: true,
        });
      },
      FunctionParameter: name =>
        createTypeTreeNode({
          name: 'parameter',
          parameterName: name.getName(),
        }),
      FunctionValueDeclaration: (
        _startBracket,
        parameters,
        _endBracket,
        returnExpression,
      ) => {
        const parametersTypes = parameters.getTypeTreeNodes();
        const returnType = returnExpression.getTypeTreeNode();

        if (
          parametersTypes.some(parameterType => !isTypeNode(parameterType)) ||
          !isTypeNode(returnType)
        )
          return createInvalidTreeNode();

        const parametersTupleType = createTypeTreeNode({
          name: 'tuple',
          items: parametersTypes as TypeNode[], // checked above
          hasValue: true,
        });

        return createTypeTreeNode({
          name: 'function',
          parameters: parametersTupleType,
          return: returnType,
          hasValue: true,
        });
      },

      // types
      stringType: _content =>
        createTypeTreeNode({ name: 'string', hasValue: false }),
      numberType: _content =>
        createTypeTreeNode({ name: 'number', hasValue: false }),
      TupleType: (_startBracket, items, _endBracket) => {
        const itemsTypes = getTupleItemsTypes(items);

        return createTypeTreeNode({
          name: 'tuple',
          items: itemsTypes,
          hasValue: false,
        });
      },
      FunctionTypeDeclaration: (parametersTuple, returnExpression) => {
        const parametersType = parametersTuple.getTypeTreeNode();
        const returnType = returnExpression.getTypeTreeNode();
        if (parametersType.name !== 'tuple' || !isTypeNode(returnType))
          return createInvalidTreeNode();

        return createTypeTreeNode({
          name: 'function',
          parameters: parametersType,
          return: returnType,
          hasValue: false,
        });
      },
      genericName: (_apostrophe, name) =>
        createTypeTreeNode({
          name: 'generic',
          genericName: name.getName(),
          hasValue: false,
        }),

      // expressions and types
      identifier: identifier =>
        createTypeTreeNode({
          name: 'variableReference',
          variableName: identifier.sourceString,
        }),

      // variable assignments
      VariableDeclaration_onlyValue: (identifier, valueAssignment) => {
        const valueType = valueAssignment.getTypeTreeNode();
        if (!isTypeNode(valueType)) return createInvalidTreeNode();

        return createTypeTreeNode({
          name: 'variableAssignment',
          variableName: identifier.getName(),
          implicitTypeNode: valueType,
          hasValue: true,
        });
      },
      VariableDeclaration_valueAndType: (
        identifier,
        typeAssignment,
        valueAssignment,
      ) => {
        const typeAssignmentType = typeAssignment.getTypeTreeNode();
        const valueAssignmentType = valueAssignment.getTypeTreeNode();

        if (!isTypeNode(typeAssignmentType) || !isTypeNode(valueAssignmentType))
          return createInvalidTreeNode();

        return createTypeTreeNode({
          name: 'variableAssignment',
          variableName: identifier.getName(),
          explicitTypeNode: typeAssignmentType,
          implicitTypeNode: valueAssignmentType,
          hasValue: true,
        });
      },
      VariableDeclaration_onlyType: (identifier, typeAssignment) => {
        const typeAssignmentType = typeAssignment.getTypeTreeNode();

        if (!isTypeNode(typeAssignmentType)) return createInvalidTreeNode();

        return createTypeTreeNode({
          name: 'variableAssignment',
          variableName: identifier.getName(),
          explicitTypeNode: typeAssignmentType,
          hasValue: false,
        });
      },
      ValueAssignment: (_assignmentOperator, value) => value.getTypeTreeNode(),
      TypeAssignment: (_typeOperator, value) => value.getTypeTreeNode(),
    },
  );
