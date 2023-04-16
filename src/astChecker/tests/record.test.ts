import { expect, test, describe } from 'vitest';
import { checkAST, CheckAstReturn } from '..';
import { codeToAST } from '../../tests/helpers';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

describe('declaration', () => {
  test('empty record with correct explicit type', () => {
    const input = codeToAST(`
    a : %{} = %{} 
  `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('empty record with incorrect explicit type', () => {
    const input = codeToAST(`
    a : %{a: string} = %{} 
  `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: {
              name: AstCheckerTypeNames.Record,
              entries: {
                a: { name: AstCheckerTypeNames.String, hasValue: false },
              },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Record,
              entries: {},
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('non empty record with correct explicit type', () => {
    const input = codeToAST(`
    a : %{a: string, b: number, c: %{a: number}} 
      = %{a: "", b: 1, c: %{a: 1}} 
  `);
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('non empty record with incorrect explicit type', () => {
    const input = codeToAST(`
    a : %{a: string, b: number, c: %{a: number}} 
      = %{a: "", b: 1, c: %{a: ""}} 
  `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: {
              name: AstCheckerTypeNames.Record,
              entries: {
                a: { name: AstCheckerTypeNames.String, hasValue: false },
                b: { name: AstCheckerTypeNames.Number, hasValue: false },
                c: {
                  name: AstCheckerTypeNames.Record,
                  entries: {
                    a: { name: AstCheckerTypeNames.Number, hasValue: false },
                  },
                  hasValue: false,
                },
              },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Record,
              entries: {
                a: { name: AstCheckerTypeNames.String, hasValue: true },
                b: { name: AstCheckerTypeNames.Number, hasValue: true },
                c: {
                  name: AstCheckerTypeNames.Record,
                  entries: {
                    a: { name: AstCheckerTypeNames.String, hasValue: true },
                  },
                  hasValue: true,
                },
              },
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
describe('accessing', () => {
  test('one level access', () => {
    const input = codeToAST(`
      record = %{a: "", b: 1} 
      a: string = record.a
      aa: record.a = record.a
      b: number = record.b
      bb: record.b = record.b

      incorrect: number = record.a
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'incorrect',
            expected: {
              name: AstCheckerTypeNames.Number,
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.String,
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('two level access', () => {
    const input = codeToAST(`
      record = %{a: "", b: 1, c: %{a: 1, b: ""}} 
      a: number = record.c.a
      aa: record.c.a = record.c.a
      b: string = record.c.b
      bb: record.b = record.c.b

      incorrect: string = record.c.a
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'incorrect',
            expected: {
              name: AstCheckerTypeNames.String,
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Number,
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
