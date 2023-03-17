import { test, describe, expect } from 'vitest';
import { checkAST, CheckAstReturn } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { codeToAST } from './utils';

describe('assigning to variable - non type checks', () => {
  test('assigning expression', () => {
    const input = codeToAST('a = 1');
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning existing variable', () => {
    const input = codeToAST(`
      a = 1
      b = a
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning non-existing variable', () => {
    const input = codeToAST('b = a');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.UnknownIdentifier,
          data: { identifier: 'a' },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('redeclaring variable in the same scope', () => {
    const input = codeToAST(`
      a = 1
      a = 2
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
          data: { identifier: 'a' },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('redeclaring variable in different scope', () => {
    const input = codeToAST(`
      a = 1
      {
        a = 2
      }
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning variable without value', () => {
    const input = codeToAST(`
      a: number 
      b = a
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: { name: CheckerTypeNames.Number, hasValue: false },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning variable with value', () => {
    const input = codeToAST(`
      a: number = 1
      b = a
    `);
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
describe('assigning to variable - basic type checks', () => {
  test('assigning same value and type', () => {
    const input = codeToAST('a: number = 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning different value and type', () => {
    const input = codeToAST('a: string = 1');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: CheckerTypeNames.String, hasValue: false },
            received: { name: CheckerTypeNames.Number, hasValue: true },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('assigning different value and type and then assigning again', () => {
    const input = codeToAST(`
      a: string = 1
      b: string = a 
      `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: CheckerTypeNames.String, hasValue: false },
            received: { name: CheckerTypeNames.Number, hasValue: true },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
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
              name: CheckerTypeNames.String,
              hasValue: false,
            },
            received: {
              name: CheckerTypeNames.Number,
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
