import { describe, expect, test } from 'vitest';
import { codeToAst } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('value', () => {
  test('without parameters', () => {
    const input = 'a()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionCallExpression,
          callee: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'a',
          },
          arguments: {
            name: AstNodeName.TupleExpression,
            items: [],
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = 'a(1)';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionCallExpression,
          callee: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'a',
          },
          arguments: {
            name: AstNodeName.TupleExpression,
            items: [
              {
                name: AstNodeName.NumberExpression,
                value: 1,
              },
            ],
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('chained', () => {
    const input = 'a()()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionCallExpression,
          callee: {
            name: AstNodeName.FunctionCallExpression,
            callee: {
              name: AstNodeName.IdentifierExpression,
              identifierName: 'a',
            },
            arguments: {
              name: AstNodeName.TupleExpression,
              items: [],
            },
          },
          arguments: {
            name: AstNodeName.TupleExpression,
            items: [],
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});

describe('type', () => {
  test('without parameters', () => {
    const input = 'a: b()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: {
            name: AstNodeName.FunctionCallType,
            callee: {
              name: AstNodeName.IdentifierType,
              identifierName: 'b',
            },
            arguments: {
              name: AstNodeName.TupleType,
              items: [],
            },
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = 'a: b(number)';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: {
            name: AstNodeName.FunctionCallType,
            callee: {
              name: AstNodeName.IdentifierType,
              identifierName: 'b',
            },
            arguments: {
              name: AstNodeName.TupleType,
              items: [
                {
                  name: AstNodeName.NumberType,
                },
              ],
            },
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('chained', () => {
    const input = 'a: b()()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: {
            name: AstNodeName.FunctionCallType,
            callee: {
              name: AstNodeName.FunctionCallType,
              callee: {
                name: AstNodeName.IdentifierType,
                identifierName: 'b',
              },
              arguments: {
                name: AstNodeName.TupleType,
                items: [],
              },
            },
            arguments: {
              name: AstNodeName.TupleType,
              items: [],
            },
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});
