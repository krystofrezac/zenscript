import { describe, expect, test } from 'vitest';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';
import { getAst } from '../getAst';

describe('value', () => {
  test('without parameters', () => {
    const input = 'a()';
    const expected = createAstNode({
      name: AstNodeName.File,
      children: [
        {
          name: AstNodeName.FunctionCallExpression,
          callee: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'a',
          },
          arguments: [],
        },
      ],
    });
    const result = getAst(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = 'a(1)';
    const expected = createAstNode({
      name: AstNodeName.File,
      children: [
        {
          name: AstNodeName.FunctionCallExpression,
          callee: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'a',
          },
          arguments: [
            {
              name: AstNodeName.NumberExpression,
              value: 1,
            },
          ],
        },
      ],
    });
    const result = getAst(input);
    expect(result).toEqual(expected);
  });
  test('chained', () => {
    const input = 'a()()';
    const expected = createAstNode({
      name: AstNodeName.File,
      children: [
        {
          name: AstNodeName.FunctionCallExpression,
          callee: {
            name: AstNodeName.FunctionCallExpression,
            callee: {
              name: AstNodeName.IdentifierExpression,
              identifierName: 'a',
            },
            arguments: [],
          },
          arguments: [],
        },
      ],
    });
    const result = getAst(input);
    expect(result).toEqual(expected);
  });
});

describe('type', () => {
  test('without parameters', () => {
    const input = 'a: b()';
    const expected = createAstNode({
      name: AstNodeName.File,
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
            arguments: [],
          },
        },
      ],
    });
    const result = getAst(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = 'a: b(number)';
    const expected = createAstNode({
      name: AstNodeName.File,
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
            arguments: [
              {
                name: AstNodeName.NumberType,
              },
            ],
          },
        },
      ],
    });
    const result = getAst(input);
    expect(result).toEqual(expected);
  });
  test('chained', () => {
    const input = 'a: b()()';
    const expected = createAstNode({
      name: AstNodeName.File,
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
              arguments: [],
            },
            arguments: [],
          },
        },
      ],
    });
    const result = getAst(input);
    expect(result).toEqual(expected);
  });
});
