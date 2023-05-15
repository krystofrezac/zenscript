import { test, describe, expect } from 'vitest';
import type { CheckAstResult } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { testCheckAst } from './helpers';

describe('string', () => {
  test('assigning only value', () => {
    const input = 'a = ""';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = 'a: string';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = 'a: string = ""';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});
describe('number', () => {
  test('assigning only value', () => {
    const input = 'a = 1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = 'a: number';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = 'a: number = 1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});
describe('block', () => {
  test('assigning block with one expression', () => {
    const input = `
      a = { 1 } 
    `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions', () => {
    const input = `
      a = { 
        b = 2
        c = b
        c
      } 
    `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and same explicit type', () => {
    const input = `
      a: number = { 
        b = 2
        c = b
        c
      } 
    `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and different explicit type', () => {
    const input = `
      a: string = { 
        b = 2
        c = b
        c
      } 
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            expected: {
              name: AstCheckerTypeNames.String,
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Number,
              hasValue: true,
            },
            variableName: 'a',
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning block with no expression', () => {
    const input = `
      a = { } 
    `;
    const expected: CheckAstResult = {
      errors: [{ name: AstCheckerErrorName.EmptyBlock, data: {} }],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});
