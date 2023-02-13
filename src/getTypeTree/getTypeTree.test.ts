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
