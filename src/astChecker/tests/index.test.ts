import { test, describe, expect } from 'vitest';
import { checkAst, CheckAstReturn } from '..';
import { codeToAst } from '../../tests/helpers';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

describe('string', () => {
  test('assigning only value', () => {
    const input = codeToAst('a = ""');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = codeToAst('a: string');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = codeToAst('a: string = ""');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
describe('number', () => {
  test('assigning only value', () => {
    const input = codeToAst('a = 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = codeToAst('a: number');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = codeToAst('a: number = 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
describe('block', () => {
  test('assigning block with one expression', () => {
    const input = codeToAst(`
      a = { 1 } 
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions', () => {
    const input = codeToAst(`
      a = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and same explicit type', () => {
    const input = codeToAst(`
      a: number = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and different explicit type', () => {
    const input = codeToAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with no expression', () => {
    const input = codeToAst(`
      a = { } 
    `);
    const expected: CheckAstReturn = {
      errors: [{ name: AstCheckerErrorName.EmptyBlock, data: {} }],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
