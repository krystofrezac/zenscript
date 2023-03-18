import { test, describe, expect } from 'vitest';
import { checkAST, CheckAstReturn } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { codeToAST } from './helpers';

describe('string', () => {
  test('assigning only value', () => {
    const input = codeToAST('a = ""');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = codeToAST('a: string');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = codeToAST('a: string = ""');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
describe('number', () => {
  test('assigning only value', () => {
    const input = codeToAST('a = 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = codeToAST('a: number');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = codeToAST('a: number = 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
describe('block', () => {
  test('assigning block with one expression', () => {
    const input = codeToAST(`
      a = { 1 } 
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions', () => {
    const input = codeToAST(`
      a = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and same explicit type', () => {
    const input = codeToAST(`
      a: number = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and different explicit type', () => {
    const input = codeToAST(`
      a: string = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = {
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
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with no expression', () => {
    const input = codeToAST(`
      a = { } 
    `);
    const expected: CheckAstReturn = {
      errors: [{ name: AstCheckerErrorName.EmptyBlock, data: {} }],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
