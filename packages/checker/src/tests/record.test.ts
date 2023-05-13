import { expect, test, describe } from 'vitest';
import type { CheckAstReturn } from '..';
import { checkAst } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { getAst } from '@zen-script/ast';

describe('declaration', () => {
  test('empty record with correct explicit type', () => {
    const input = getAst(`
    a : %{} = %{} 
  `);
    const expected: CheckAstReturn = { errors: [], exportedVariables: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('empty record with incorrect explicit type', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('non empty record with correct explicit type', () => {
    const input = getAst(`
    a : %{a: string, b: number, c: %{a: number}} 
      = %{a: "", b: 1, c: %{a: 1}} 
  `);
    const expected: CheckAstReturn = { errors: [], exportedVariables: [] };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('non empty record with incorrect explicit type', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
describe('accessing', () => {
  test('one level access', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('two level access', () => {
    const input = getAst(`
      record = %{a: "", b: 1, c: %{a: 1, b: ""}} 
      a: number = record.c.a
      aa: record.c.a = record.c.a
      b: string = record.c.b
      bb: record.c.b = record.c.b

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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('accessing non existing entry', () => {
    const input = getAst(`
      record = %{a: 1}
      entry = record.b
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.EntryDoesNotExistOnRecord,
          data: {
            record: {
              name: AstCheckerTypeNames.Record,
              entries: {
                a: { name: AstCheckerTypeNames.Number, hasValue: true },
              },
              hasValue: true,
            },
            entryName: 'b',
          },
        },
      ],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('accessing non record', () => {
    const input = getAst(`
      nonRecord = 1 
      entry = nonRecord.someField
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.AccessingNonRecord,
          data: {
            accessing: AstCheckerTypeNames.Number,
          },
        },
      ],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
