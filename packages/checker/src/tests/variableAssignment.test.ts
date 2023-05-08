import { describe, test, expect } from 'vitest';
import { CheckAstReturn, checkAst } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { getAst } from '@sphere-script/ast';

describe('non type checks', () => {
  test('assigning expression', () => {
    const input = getAst('a = 1');
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning existing variable', () => {
    const input = getAst(`
      a = 1
      b = a
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning non-existing variable', () => {
    const input = getAst('b = a');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.UnknownIdentifier,
          data: { identifier: 'a' },
        },
      ],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('redeclaring variable in the same scope', () => {
    const input = getAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('redeclaring variable in different scope', () => {
    const input = getAst(`
      a = 1
      {
        a = 2
      }
    `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning variable without value', () => {
    const input = getAst(`
      a: number 
      b = a
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: AstCheckerTypeNames.Number,
              hasValue: false,
            },
          },
        },
      ],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning variable with value', () => {
    const input = getAst(`
      a: number = 1
      b = a
    `);
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});

describe('basic type checks', () => {
  test('assigning same value and type', () => {
    const input = getAst('a: number = 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning different value and type', () => {
    const input = getAst('a: string = 1');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: AstCheckerTypeNames.String, hasValue: false },
            received: { name: AstCheckerTypeNames.Number, hasValue: true },
          },
        },
      ],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('assigning different value and type and then assigning again', () => {
    const input = getAst(`
      a: string = 1
      b: string = a 
      `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: AstCheckerTypeNames.String, hasValue: false },
            received: { name: AstCheckerTypeNames.Number, hasValue: true },
          },
        },
      ],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
