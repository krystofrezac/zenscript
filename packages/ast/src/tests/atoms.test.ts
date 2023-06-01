import { expect, test } from 'vitest';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';
import { getAst } from '../getAst';

test('empty atom expression', () => {
  const input = 'a = MyAtom';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        expression: {
          name: AstNodeName.AtomExpression,
          atomName: 'MyAtom',
          arguments: [],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('empty atom expression with brackets', () => {
  const input = 'a = MyAtom()';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        expression: {
          name: AstNodeName.AtomExpression,
          atomName: 'MyAtom',
          arguments: [],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('non empty atom expression', () => {
  const input = 'a = MyAtom(1, "", %{a: 1})';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        expression: {
          name: AstNodeName.AtomExpression,
          atomName: 'MyAtom',
          arguments: [
            { name: AstNodeName.NumberExpression, value: 1 },
            { name: AstNodeName.StringExpression, value: '' },
            {
              name: AstNodeName.RecordExpression,
              entries: [
                {
                  name: AstNodeName.RecordEntryExpression,
                  key: 'a',
                  value: { name: AstNodeName.NumberExpression, value: 1 },
                },
              ],
            },
          ],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});

test('empty atom type', () => {
  const input = 'a : MyAtom';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        type: {
          name: AstNodeName.AtomType,
          atomName: 'MyAtom',
          arguments: [],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});

test('empty atom type with brackets', () => {
  const input = 'a : MyAtom()';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        type: {
          name: AstNodeName.AtomType,
          atomName: 'MyAtom',
          arguments: [],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('non empty atom type', () => {
  const input = 'a : MyAtom(number, string, %{a: number})';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        type: {
          name: AstNodeName.AtomType,
          atomName: 'MyAtom',
          arguments: [
            { name: AstNodeName.NumberType },
            { name: AstNodeName.StringType },
            {
              name: AstNodeName.RecordType,
              entries: [
                {
                  name: AstNodeName.RecordEntryType,
                  key: 'a',
                  value: { name: AstNodeName.NumberType },
                },
              ],
            },
          ],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('atom union type', () => {
  const input = 'myVar: A | B(%{a: number}) | C(string)';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'myVar',
        type: {
          name: AstNodeName.AtomUnionType,
          atoms: [
            { name: AstNodeName.AtomType, atomName: 'A', arguments: [] },
            {
              name: AstNodeName.AtomType,
              atomName: 'B',
              arguments: [
                {
                  name: AstNodeName.RecordType,
                  entries: [
                    {
                      name: AstNodeName.RecordEntryType,
                      key: 'a',
                      value: {
                        name: AstNodeName.NumberType,
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: AstNodeName.AtomType,
              atomName: 'C',
              arguments: [{ name: AstNodeName.StringType }],
            },
          ],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
