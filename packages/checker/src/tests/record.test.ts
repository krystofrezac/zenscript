import { expect, test, describe } from 'vitest';
import type { CheckAstResult } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeName } from '../types/types';
import { testCheckAst } from './helpers';

describe('declaration', () => {
  test('empty record with correct explicit type', () => {
    const input = `
    a : %{} = %{} 
  `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('empty record with incorrect explicit type', () => {
    const input = `
    a : %{a: string} = %{} 
  `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: {
              name: AstCheckerTypeName.Record,
              entries: {
                a: { name: AstCheckerTypeName.String, hasValue: false },
              },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeName.Record,
              entries: {},
              hasValue: true,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('non empty record with correct explicit type', () => {
    const input = `
    a : %{a: string, b: number, c: %{a: number}} 
      = %{a: "", b: 1, c: %{a: 1}} 
  `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('non empty record with incorrect explicit type', () => {
    const input = `
    a : %{a: string, b: number, c: %{a: number}} 
      = %{a: "", b: 1, c: %{a: ""}} 
  `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: {
              name: AstCheckerTypeName.Record,
              entries: {
                a: { name: AstCheckerTypeName.String, hasValue: false },
                b: { name: AstCheckerTypeName.Number, hasValue: false },
                c: {
                  name: AstCheckerTypeName.Record,
                  entries: {
                    a: { name: AstCheckerTypeName.Number, hasValue: false },
                  },
                  hasValue: false,
                },
              },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeName.Record,
              entries: {
                a: { name: AstCheckerTypeName.String, hasValue: true },
                b: { name: AstCheckerTypeName.Number, hasValue: true },
                c: {
                  name: AstCheckerTypeName.Record,
                  entries: {
                    a: { name: AstCheckerTypeName.String, hasValue: true },
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
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});
describe('accessing', () => {
  test('one level access', () => {
    const input = `
      record = %{a: "", b: 1} 
      a: string = record.a
      aa: record.a = record.a
      b: number = record.b
      bb: record.b = record.b

      incorrect: number = record.a
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'incorrect',
            expected: {
              name: AstCheckerTypeName.Number,
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeName.String,
              hasValue: true,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('two level access', () => {
    const input = `
      record = %{a: "", b: 1, c: %{a: 1, b: ""}} 
      a: number = record.c.a
      aa: record.c.a = record.c.a
      b: string = record.c.b
      bb: record.c.b = record.c.b

      incorrect: string = record.c.a
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'incorrect',
            expected: {
              name: AstCheckerTypeName.String,
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeName.Number,
              hasValue: true,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('accessing non existing entry', () => {
    const input = `
      record = %{a: 1}
      entry = record.b
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.EntryDoesNotExistOnRecord,
          data: {
            record: {
              name: AstCheckerTypeName.Record,
              entries: {
                a: { name: AstCheckerTypeName.Number, hasValue: true },
              },
              hasValue: true,
            },
            entryName: 'b',
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('accessing non record', () => {
    const input = `
      nonRecord = 1 
      entry = nonRecord.someField
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.AccessingNonRecord,
          data: {
            accessing: AstCheckerTypeName.Number,
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});
