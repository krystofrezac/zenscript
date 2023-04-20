import { describe, expect, test } from 'vitest';
import { codeToAst } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('empty', () => {
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [],
  });
  test('empty string', () => {
    const input = '';
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('string with spaces', () => {
    const input = '   ';
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});
describe('string', () => {
  test('only string', () => {
    const input = '"Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        { name: AstNodeName.StringExpression, value: 'Hello, World!' },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable', () => {
    const input = 'a = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: {
            name: AstNodeName.StringExpression,
            value: 'Hello, World!',
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with same explicit type', () => {
    const input = 'a: string = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: {
            name: AstNodeName.StringExpression,
            value: 'Hello, World!',
          },
          type: { name: AstNodeName.StringType },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with different explicit type', () => {
    const input = 'a: number = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: {
            name: AstNodeName.StringExpression,
            value: 'Hello, World!',
          },
          type: { name: AstNodeName.NumberType },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('string type assigned to variable', () => {
    const input = 'a: string';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: { name: AstNodeName.StringType },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});

describe('number', () => {
  test('only number', () => {
    const input = '1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.NumberExpression, value: 1 }],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable', () => {
    const input = 'a = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: { name: AstNodeName.NumberExpression, value: 1 },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with same explicit type', () => {
    const input = 'a: number = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: { name: AstNodeName.NumberExpression, value: 1 },
          type: { name: AstNodeName.NumberType },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with different explicit type', () => {
    const input = 'a: string = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: { name: AstNodeName.NumberExpression, value: 1 },
          type: { name: AstNodeName.StringType },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('number type assigned to variable', () => {
    const input = 'a: number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: { name: AstNodeName.NumberType },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});

describe('variable reference', () => {
  test('referencing value', () => {
    const input = `
      a = 1
      b = a
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: { name: AstNodeName.NumberExpression, value: 1 },
        },
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'b',
          expression: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'a',
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('referencing type', () => {
    const input = `
      a = 1
      b: a 
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: { name: AstNodeName.NumberExpression, value: 1 },
        },
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'b',
          type: {
            name: AstNodeName.IdentifierType,
            identifierName: 'a',
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
  test('referencing value and type', () => {
    const input = `
      a = 1
      b: number
      c: b = a
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: { name: AstNodeName.NumberExpression, value: 1 },
        },
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'b',
          type: { name: AstNodeName.NumberType },
        },
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'c',
          type: {
            name: AstNodeName.IdentifierType,
            identifierName: 'b',
          },
          expression: {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'a',
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});
