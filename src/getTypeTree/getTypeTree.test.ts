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
          implicitTypeNode: { name: 'variableReference', variableName: 'a' },
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
          explicitTypeNode: { name: 'variableReference', variableName: 'a' },
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
          explicitTypeNode: { name: 'variableReference', variableName: 'b' },
          implicitTypeNode: { name: 'variableReference', variableName: 'a' },
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
              variableName: 'b',
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

describe('tuple tree', () => {
  test('empty tuple', () => {
    const input = '()';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [{ name: 'tuple', items: [], hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('one item tuple', () => {
    const input = '(1)';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'tuple',
          items: [{ name: 'number', hasValue: true }],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('multiple items tuple', () => {
    const input = '(1, "", (1))';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'tuple',
          items: [
            { name: 'number', hasValue: true },
            { name: 'string', hasValue: true },
            {
              name: 'tuple',
              items: [{ name: 'number', hasValue: true }],
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
  test('tuple assigned to variable', () => {
    const input = 'a = (1)';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          implicitTypeNode: {
            name: 'tuple',
            items: [{ name: 'number', hasValue: true }],
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
  test('tuple assigned to variable with same explicit type', () => {
    const input = 'a: (number) = (1)';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: {
            name: 'tuple',
            items: [{ name: 'number', hasValue: false }],
            hasValue: false,
          },
          implicitTypeNode: {
            name: 'tuple',
            items: [{ name: 'number', hasValue: true }],
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
  test('tuple assigned to variable with different explicit type', () => {
    const input = 'a: number = (1)';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: { name: 'number', hasValue: false },
          implicitTypeNode: {
            name: 'tuple',
            items: [{ name: 'number', hasValue: true }],
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
});

describe('function value tree', () => {
  test('without parameters', () => {
    const input = '() 1';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'function',
          parameters: { name: 'tuple', items: [], hasValue: true },
          return: { name: 'number', hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = '(a, b) b';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'function',
          parameters: {
            name: 'tuple',
            items: [
              {
                name: 'parameter',
                parameterName: 'a',
              },
              {
                name: 'parameter',
                parameterName: 'b',
              },
            ],
            hasValue: true,
          },
          return: { name: 'variableReference', variableName: 'b' },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('with complex return', () => {
    const input = `
      (a, b) {
        c = a
        c
      }
    `;
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'function',
          parameters: {
            name: 'tuple',
            items: [
              {
                name: 'parameter',
                parameterName: 'a',
              },
              {
                name: 'parameter',
                parameterName: 'b',
              },
            ],
            hasValue: true,
          },
          return: {
            name: 'block',
            children: [
              {
                name: 'variableAssignment',
                variableName: 'c',
                implicitTypeNode: {
                  name: 'variableReference',
                  variableName: 'a',
                },
                hasValue: true,
              },
              {
                name: 'variableReference',
                variableName: 'c',
              },
            ],
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
});

describe('function type tree', () => {
  test('without parameters', () => {
    const input = 'a: () number';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: {
            name: 'function',
            parameters: { name: 'tuple', items: [], hasValue: false },
            return: { name: 'number', hasValue: false },
            hasValue: false,
          },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('with simple parameters', () => {
    const input = 'a: (number) number';
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: {
            name: 'function',
            parameters: {
              name: 'tuple',
              items: [
                {
                  name: 'number',
                  hasValue: false,
                },
              ],
              hasValue: false,
            },
            return: { name: 'number', hasValue: false },
            hasValue: false,
          },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('with generic parameters', () => {
    const input = "a: ('a) 'a";
    const expected = createTypeTreeNode({
      name: 'block',
      children: [
        {
          name: 'variableAssignment',
          variableName: 'a',
          explicitTypeNode: {
            name: 'function',
            parameters: {
              name: 'tuple',
              items: [
                {
                  name: 'generic',
                  genericName: 'a',
                  hasValue: false,
                },
              ],
              hasValue: false,
            },
            return: {
              name: 'generic',
              genericName: 'a',
              hasValue: false,
            },
            hasValue: false,
          },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

// TODO: function calls
