import { expect, test } from 'vitest';
import { checkAST, CheckAstReturn } from '..';
import { codeToAST } from '../../tests/helpers';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

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
