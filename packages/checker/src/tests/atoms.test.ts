/**
 * - Assigning s
 *
 *
 */

import { expect, test } from 'vitest';
import type { CheckAstResult } from '..';
import { testCheckAst } from './helpers';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

test('correct assigning single simple atom', () => {
  const input = 'myVar: Atom = Atom';
  const expected: CheckAstResult = { errors: [], exportedVariables: [] };
  const result = testCheckAst({ entryFile: input });
  expect(result).toEqual(expected);
});
test('incorrect assigning single simple atom', () => {
  const input = 'myVar: Atom = OtherAtom';
  const expected: CheckAstResult = {
    errors: [
      {
        name: AstCheckerErrorName.VariableTypeMismatch,
        data: {
          variableName: 'myVar',
          expected: {
            name: AstCheckerTypeNames.Atom,
            atomName: 'Atom',
            arguments: [],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeNames.Atom,
            atomName: 'OtherAtom',
            arguments: [],
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
test('correct assigning simple atom to union', () => {
  const input = 'myVar: Atom | AtomTwo | AtomThree = AtomTwo';
  const expected: CheckAstResult = { errors: [], exportedVariables: [] };
  const result = testCheckAst({ entryFile: input });
  expect(result).toEqual(expected);
});
test('incorrect assigning simple atom to union', () => {
  const input = 'myVar: Atom | AtomTwo | AtomThree = AtomFour';
  const expected: CheckAstResult = {
    errors: [
      {
        name: AstCheckerErrorName.VariableTypeMismatch,
        data: {
          variableName: 'myVar',
          expected: {
            name: AstCheckerTypeNames.AtomUnion,
            atoms: [
              {
                name: AstCheckerTypeNames.Atom,
                atomName: 'Atom',
                arguments: [],
                hasValue: false,
              },
              {
                name: AstCheckerTypeNames.Atom,
                atomName: 'AtomTwo',
                arguments: [],
                hasValue: false,
              },
              {
                name: AstCheckerTypeNames.Atom,
                atomName: 'AtomThree',
                arguments: [],
                hasValue: false,
              },
            ],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeNames.Atom,
            atomName: 'AtomFour',
            arguments: [],
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
test('correct assigning single complex atom', () => {
  const input = 'myVar: Atom(string, %{a: number}) = Atom("", %{a: 1})';
  const expected: CheckAstResult = { errors: [], exportedVariables: [] };
  const result = testCheckAst({ entryFile: input });
  expect(result).toEqual(expected);
});
test('incorrect assigning single complex atom', () => {
  const input = 'myVar: Atom(string, %{a: number}) = Atom(1, %{a: 1})';
  const expected: CheckAstResult = {
    errors: [
      {
        name: AstCheckerErrorName.VariableTypeMismatch,
        data: {
          variableName: 'myVar',
          expected: {
            name: AstCheckerTypeNames.Atom,
            atomName: 'Atom',
            arguments: [
              { name: AstCheckerTypeNames.String, hasValue: false },
              {
                name: AstCheckerTypeNames.Record,
                entries: {
                  a: { name: AstCheckerTypeNames.Number, hasValue: false },
                },
                hasValue: false,
              },
            ],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeNames.Atom,
            atomName: 'Atom',
            arguments: [
              { name: AstCheckerTypeNames.Number, hasValue: true },
              {
                name: AstCheckerTypeNames.Record,
                entries: {
                  a: { name: AstCheckerTypeNames.Number, hasValue: true },
                },
                hasValue: true,
              },
            ],
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
test('correct assigning complex atom to union', () => {
  const input =
    'myVar: Atom(string, %{a: number}) | AtomTwo(number) | AtomThree(%{b: string}) = AtomTwo(1)';
  const expected: CheckAstResult = { errors: [], exportedVariables: [] };
  const result = testCheckAst({ entryFile: input });
  expect(result).toEqual(expected);
});
test('incorrect assigning complex atom to union', () => {
  const input =
    'myVar: Atom(string, %{a: number}) | AtomTwo(number) | AtomTwo(%{}) = AtomTwo("")';
  const expected: CheckAstResult = {
    errors: [
      {
        name: AstCheckerErrorName.VariableTypeMismatch,
        data: {
          variableName: 'myVar',
          expected: {
            name: AstCheckerTypeNames.AtomUnion,
            atoms: [
              {
                name: AstCheckerTypeNames.Atom,
                atomName: 'Atom',
                arguments: [
                  { name: AstCheckerTypeNames.String, hasValue: false },
                  {
                    name: AstCheckerTypeNames.Record,
                    entries: {
                      a: { name: AstCheckerTypeNames.Number, hasValue: false },
                    },
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              {
                name: AstCheckerTypeNames.Atom,
                atomName: 'AtomTwo',
                arguments: [
                  { name: AstCheckerTypeNames.Number, hasValue: false },
                ],
                hasValue: false,
              },
              {
                name: AstCheckerTypeNames.Atom,
                atomName: 'AtomTwo',
                arguments: [
                  {
                    name: AstCheckerTypeNames.Record,
                    entries: {},
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
            ],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeNames.Atom,
            atomName: 'AtomTwo',
            arguments: [{ name: AstCheckerTypeNames.String, hasValue: true }],
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
