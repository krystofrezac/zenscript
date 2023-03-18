import { expect, test } from 'vitest';
import { codeToAST } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

test('empty record value', () => {
  const input = `
     a = %{}
  `;
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        implicitType: {
          name: AstNodeName.Record,
          entries: [],
          hasValue: true,
        },
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('empty record type', () => {
  const input = `
     a: %{}
  `;
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        explicitType: {
          name: AstNodeName.Record,
          entries: [],
          hasValue: false,
        },
        hasValue: false,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('non empty record value', () => {
  const input = `
     a = %{
        a: 1,
        b: "",
        c: %{
          a: 1
        }
     }
  `;
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        implicitType: {
          name: AstNodeName.Record,
          entries: [
            {
              name: AstNodeName.RecordEntry,
              key: 'a',
              value: {
                name: AstNodeName.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            {
              name: AstNodeName.RecordEntry,
              key: 'b',
              value: {
                name: AstNodeName.String,
                hasValue: true,
              },
              hasValue: true,
            },
            {
              name: AstNodeName.RecordEntry,
              key: 'c',
              value: {
                name: AstNodeName.Record,
                entries: [
                  {
                    name: AstNodeName.RecordEntry,
                    key: 'a',
                    value: {
                      name: AstNodeName.Number,
                      hasValue: true,
                    },
                    hasValue: true,
                  },
                ],
                hasValue: true,
              },
              hasValue: true,
            },
          ],
          hasValue: true,
        },
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('non empty record type', () => {
  const input = `
     a : %{
        a: number,
        b: string,
        c: %{
          a: number
        }
     }
  `;
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        explicitType: {
          name: AstNodeName.Record,
          entries: [
            {
              name: AstNodeName.RecordEntry,
              key: 'a',
              value: {
                name: AstNodeName.Number,
                hasValue: false,
              },
              hasValue: false,
            },
            {
              name: AstNodeName.RecordEntry,
              key: 'b',
              value: {
                name: AstNodeName.String,
                hasValue: false,
              },
              hasValue: false,
            },
            {
              name: AstNodeName.RecordEntry,
              key: 'c',
              value: {
                name: AstNodeName.Record,
                entries: [
                  {
                    name: AstNodeName.RecordEntry,
                    key: 'a',
                    value: {
                      name: AstNodeName.Number,
                      hasValue: false,
                    },
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              hasValue: false,
            },
          ],
          hasValue: false,
        },
        hasValue: false,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
