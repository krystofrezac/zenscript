import { expect, test } from 'vitest';
import type { CheckAstResult } from '..';
import { testCheckAst } from './helpers';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeName } from '../types/types';

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
            name: AstCheckerTypeName.Atom,
            atomName: 'Atom',
            arguments: [],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeName.Atom,
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
            name: AstCheckerTypeName.AtomUnion,
            atoms: [
              {
                name: AstCheckerTypeName.Atom,
                atomName: 'Atom',
                arguments: [],
                hasValue: false,
              },
              {
                name: AstCheckerTypeName.Atom,
                atomName: 'AtomTwo',
                arguments: [],
                hasValue: false,
              },
              {
                name: AstCheckerTypeName.Atom,
                atomName: 'AtomThree',
                arguments: [],
                hasValue: false,
              },
            ],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeName.Atom,
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
            name: AstCheckerTypeName.Atom,
            atomName: 'Atom',
            arguments: [
              { name: AstCheckerTypeName.String, hasValue: false },
              {
                name: AstCheckerTypeName.Record,
                entries: {
                  a: { name: AstCheckerTypeName.Number, hasValue: false },
                },
                hasValue: false,
              },
            ],
            hasValue: false,
          },
          received: {
            name: AstCheckerTypeName.Atom,
            atomName: 'Atom',
            arguments: [
              { name: AstCheckerTypeName.Number, hasValue: true },
              {
                name: AstCheckerTypeName.Record,
                entries: {
                  a: { name: AstCheckerTypeName.Number, hasValue: true },
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
  const input = `
      expectedType : Atom(string, %{a: number}) | AtomTwo(number) | AtomTwo(%{})
      myVar : expectedType = AtomTwo("")
    `;
  const expected: CheckAstResult = {
    errors: [
      {
        name: AstCheckerErrorName.VariableTypeMismatch,
        data: {
          variableName: 'myVar',
          expected: {
            name: AstCheckerTypeName.AtomUnion,
            atoms: [
              {
                name: AstCheckerTypeName.Atom,
                atomName: 'Atom',
                arguments: [
                  { name: AstCheckerTypeName.String, hasValue: false },
                  {
                    name: AstCheckerTypeName.Record,
                    entries: {
                      a: { name: AstCheckerTypeName.Number, hasValue: false },
                    },
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              {
                name: AstCheckerTypeName.Atom,
                atomName: 'AtomTwo',
                arguments: [
                  { name: AstCheckerTypeName.Number, hasValue: false },
                ],
                hasValue: false,
              },
              {
                name: AstCheckerTypeName.Atom,
                atomName: 'AtomTwo',
                arguments: [
                  {
                    name: AstCheckerTypeName.Record,
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
            name: AstCheckerTypeName.Atom,
            atomName: 'AtomTwo',
            arguments: [{ name: AstCheckerTypeName.String, hasValue: true }],
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
