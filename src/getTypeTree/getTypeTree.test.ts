import { describe, expect, test } from 'vitest';
import { getTypeTree } from '.';
import { parse } from '../parser';
import { createSemantics } from '../semantics';
import { createTypeTreeNode } from './helpers/createTypeTreeNode';

const semantics = createSemantics();
const getTree = (input: string) => {
  const adapter = semantics(parse(input));

  return getTypeTree(adapter);
};

describe('empty tree', () => {
  const expected = createTypeTreeNode({
    name: 'block',
    children: [],
    hasValue: true,
  });
  test('empty string', () => {
    const input = '';
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string with spaces', () => {
    const input = '   ';
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});
describe('string tree', () => {
  test('only string', () => {
    const input = '"Hello, World!"';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [{ name: 'string', hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable', () => {
    const input = 'a = "Hello, World!"';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'string', hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with same explicit type', () => {
    const input = 'a: string = "Hello, World!"';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'string', hasValue: true },
          explicitTypeNode: { name: 'string', hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with different explicit type', () => {
    const input = 'a: number = "Hello, World!"';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'string', hasValue: true },
          explicitTypeNode: { name: 'number', hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string type assigned to variable', () => {
    const input = 'a: string';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: { name: 'string', hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('number tree', () => {
  test('only number', () => {
    const input = '1';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [{ name: 'number', hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable', () => {
    const input = 'a = 1';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'number', hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with same explicit type', () => {
    const input = 'a: number = 1';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'number', hasValue: true },
          explicitTypeNode: { name: 'number', hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with different explicit type', () => {
    const input = 'a: string = 1';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'number', hasValue: true },
          explicitTypeNode: { name: 'string', hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number type assigned to variable', () => {
    const input = 'a: number';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: { name: 'number', hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('variable reference tree', () => {
  test('referencing value', () => {
    const input = `
      a = 1
      b = a
    `;
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'number', hasValue: true },
          hasValue: true,
        },
        {
          name: 'variableAssignment',
          variableName: 'b',
          implicitTypeNode: { name: 'variableReference', identifierName: 'a' },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('referencing type', () => {
    const input = `
      a = 1
      b: a 
    `;
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'number', hasValue: true },
          hasValue: true,
        },
        {
          name: 'variableAssignment',
          variableName: 'b',
          explicitTypeNode: { name: 'variableReference', identifierName: 'a' },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('referencing value and type', () => {
    const input = `
      a = 1
      b: number
      c: b = a
    `;
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: { name: 'number', hasValue: true },
          hasValue: true,
        },
        {
          name: 'variableAssignment',
          variableName: 'b',
          explicitTypeNode: { name: 'number', hasValue: false },
          hasValue: false,
        },
        {
          name: 'variableAssignment',
          variableName: 'c',
          explicitTypeNode: { name: 'variableReference', identifierName: 'b' },
          implicitTypeNode: { name: 'variableReference', identifierName: 'a' },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('block tree', () => {
  test('empty block', () => {
    const input = '{}';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [{ name: 'block', children: [], hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block with string value', () => {
    const input = '{""}';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'block',
          children: [{ name: 'string', hasValue: true }],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block with number value', () => {
    const input = '{1}';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'block',
          children: [{ name: 'number', hasValue: true }],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block with variable assignments', () => {
    const input = `{
      a = 1
      b = 2
      b
    }`;
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'block',
          children: [
            {
              name: 'variableAssignment',
              variableName: 'a',
              implicitTypeNode: { name: 'number', hasValue: true },
              hasValue: true,
            },
            {
              name: 'variableAssignment',
              variableName: 'b',
              implicitTypeNode: { name: 'number', hasValue: true },
              hasValue: true,
            },
            {
              name: 'variableReference',
              identifierName: 'b',
            },
          ],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block assigned to variable', () => {
    const input = 'a = {1}';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: {
            name: 'block',
            children: [{ name: 'number', hasValue: true }],
            hasValue: true,
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('nested blocks', () => {
    const input = `
      {
        a = 1
        {
          a = "hello"
        }
      }
    `;
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'block',
          children: [
            {
              name: 'variableAssignment',
              variableName: 'a',
              implicitTypeNode: { name: 'number', hasValue: true },
              hasValue: true,
            },
            {
              name: 'block',
              children: [
                {
                  name: 'variableAssignment',
                  variableName: 'a',
                  implicitTypeNode: { name: 'string', hasValue: true },
                  hasValue: true,
                },
              ],
              hasValue: true,
            },
          ],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});
