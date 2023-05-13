import { test, describe, expect } from 'vitest';
import type { CheckAstReturn } from '..';
import { checkAst } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { getAst } from '@zen-script/ast';

describe('string', () => {
  test('assigning only value', () => {
    const input = getAst('a = ""');
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = getAst('a: string');
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = getAst('a: string = ""');
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
describe('number', () => {
  test('assigning only value', () => {
    const input = getAst('a = 1');
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning only type', () => {
    const input = getAst('a: number');
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning same value and type', () => {
    const input = getAst('a: number = 1');
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
describe('block', () => {
  test('assigning block with one expression', () => {
    const input = getAst(`
      a = { 1 } 
    `);
    const expected: CheckAstReturn = { errors: [], exportedVariables: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions', () => {
    const input = getAst(`
      a = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = { errors: [], exportedVariables: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and same explicit type', () => {
    const input = getAst(`
      a: number = { 
        b = 2
        c = b
        c
      } 
    `);
    const expected: CheckAstReturn = { errors: [], exportedVariables: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with more expressions and different explicit type', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning block with no expression', () => {
    const input = getAst(`
      a = { } 
    `);
    const expected: CheckAstReturn = {
      errors: [{ name: AstCheckerErrorName.EmptyBlock, data: {} }],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
