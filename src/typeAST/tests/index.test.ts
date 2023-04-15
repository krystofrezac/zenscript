import { describe, expect, test } from 'vitest';
import { codeToAST } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('empty', () => {
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [],
    hasValue: true,
  });
  test('empty string', () => {
    const input = '';
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('string with spaces', () => {
    const input = '   ';
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
});
describe('string', () => {
  test('only string', () => {
    const input = '"Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.String, hasValue: true }],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable', () => {
    const input = 'a = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.String, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with same explicit type', () => {
    const input = 'a: string = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.String, hasValue: true },
          explicitType: { name: AstNodeName.String, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with different explicit type', () => {
    const input = 'a: number = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.String, hasValue: true },
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('string type assigned to variable', () => {
    const input = 'a: string';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: { name: AstNodeName.String, hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
});

describe('number', () => {
  test('only number', () => {
    const input = '1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.Number, hasValue: true }],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable', () => {
    const input = 'a = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with same explicit type', () => {
    const input = 'a: number = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with different explicit type', () => {
    const input = 'a: string = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          explicitType: { name: AstNodeName.String, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('number type assigned to variable', () => {
    const input = 'a: number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
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
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'b',
          implicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
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
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'b',
          explicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
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
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'b',
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: false,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'c',
          explicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'b',
          },
          implicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
});
