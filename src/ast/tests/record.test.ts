import { expect, test, describe } from 'vitest';
import { codeToAst } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('declaration', () => {
  test('empty record value', () => {
    const input = `
     a = %{}
  `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          expression: {
            name: AstNodeName.RecordExpression,
            entries: [],
          },
        },
      ],
    });
    const result = codeToAst(input);
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
          identifierName: 'a',
          type: {
            name: AstNodeName.RecordType,
            entries: [],
          },
        },
      ],
    });
    const result = codeToAst(input);
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
          identifierName: 'a',
          expression: {
            name: AstNodeName.RecordExpression,
            entries: [
              {
                name: AstNodeName.RecordEntryExpression,
                key: 'a',
                value: {
                  name: AstNodeName.NumberExpression,
                  value: 1,
                },
              },
              {
                name: AstNodeName.RecordEntryExpression,
                key: 'b',
                value: {
                  name: AstNodeName.StringExpression,
                  value: '',
                },
              },
              {
                name: AstNodeName.RecordEntryExpression,
                key: 'c',
                value: {
                  name: AstNodeName.RecordExpression,
                  entries: [
                    {
                      name: AstNodeName.RecordEntryExpression,
                      key: 'a',
                      value: {
                        name: AstNodeName.NumberExpression,
                        value: 1,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const result = codeToAst(input);
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
          identifierName: 'a',
          type: {
            name: AstNodeName.RecordType,
            entries: [
              {
                name: AstNodeName.RecordEntryType,
                key: 'a',
                value: { name: AstNodeName.NumberType },
              },
              {
                name: AstNodeName.RecordEntryType,
                key: 'b',
                value: {
                  name: AstNodeName.StringType,
                },
              },
              {
                name: AstNodeName.RecordEntryType,
                key: 'c',
                value: {
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
              },
            ],
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});

describe('accessing', () => {
  test('accessing variable', () => {
    const input = `
      a: record.entryA.entryB.entryC = record.entryA.entryB.entrySameAsC
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          identifierName: 'a',
          type: {
            name: AstNodeName.RecordEntryAccessType,
            entryName: 'entryC',
            accessing: {
              name: AstNodeName.RecordEntryAccessType,
              entryName: 'entryB',
              accessing: {
                name: AstNodeName.RecordEntryAccessType,
                entryName: 'entryA',
                accessing: {
                  name: AstNodeName.IdentifierType,
                  identifierName: 'record',
                },
              },
            },
          },
          expression: {
            name: AstNodeName.RecordEntryAccessExpression,
            entryName: 'entrySameAsC',
            accessing: {
              name: AstNodeName.RecordEntryAccessExpression,
              entryName: 'entryB',
              accessing: {
                name: AstNodeName.RecordEntryAccessExpression,
                entryName: 'entryA',
                accessing: {
                  name: AstNodeName.IdentifierExpression,
                  identifierName: 'record',
                },
              },
            },
          },
        },
      ],
    });
    const result = codeToAst(input);
    expect(result).toEqual(expected);
  });
});
