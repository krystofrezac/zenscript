import { describe, expect, test } from 'vitest';
import { codeToAst } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('value', () => {
  test('without parameters', () => {
    const input = '() 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionDeclarationExpression,
          parameters: [],
          return: { name: AstNodeName.NumberExpression, value: 1 },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = '(a, b) b';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionDeclarationExpression,
          parameters: [
            {
              name: AstNodeName.IdentifierExpression,
              identifierName: 'a',
            },
            {
              name: AstNodeName.IdentifierExpression,
              identifierName: 'b',
            },
          ],
          return: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'b',
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('with complex return', () => {
    const input = `
      (a, b) {
        c = a
        c
      }
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionDeclarationExpression,
          parameters: [
            {
              name: AstNodeName.IdentifierExpression,
              identifierName: 'a',
            },
            {
              name: AstNodeName.IdentifierExpression,
              identifierName: 'b',
            },
          ],
          return: {
            name: AstNodeName.Block,
            children: [
              {
                name: AstNodeName.VariableAssignment,
                identifierName: 'c',
                expression: {
                  name: AstNodeName.IdentifierExpression,
                  identifierName: 'a',
                },
              },
              {
                name: AstNodeName.IdentifierExpression,
                identifierName: 'c',
              },
            ],
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
    const input = 'a: () number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: {
            name: AstNodeName.FunctionDeclarationType,
            parameters: [],
            return: { name: AstNodeName.NumberType },
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('with simple parameters', () => {
    const input = 'a: (number) number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: {
            name: AstNodeName.FunctionDeclarationType,
            parameters: [
              {
                name: AstNodeName.NumberType,
              },
            ],
            return: { name: AstNodeName.NumberType },
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});
