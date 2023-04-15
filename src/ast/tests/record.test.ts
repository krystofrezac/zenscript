import { expect, test, describe } from 'vitest';
import { codeToAST } from '../../tests/helpers';
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
          variableName: 'a',
          explicitType: {
            name: AstNodeName.RecordEntryAccess,
            entryName: 'entryC',
            accessing: {
              name: AstNodeName.RecordEntryAccess,
              entryName: 'entryB',
              accessing: {
                name: AstNodeName.RecordEntryAccess,
                entryName: 'entryA',
                accessing: {
                  name: AstNodeName.VariableReference,
                  variableName: 'record',
                },
                hasValue: false,
              },
              hasValue: false,
            },
            hasValue: false,
          },
          implicitType: {
            name: AstNodeName.RecordEntryAccess,
            entryName: 'entrySameAsC',
            accessing: {
              name: AstNodeName.RecordEntryAccess,
              entryName: 'entryB',
              accessing: {
                name: AstNodeName.RecordEntryAccess,
                entryName: 'entryA',
                accessing: {
                  name: AstNodeName.VariableReference,
                  variableName: 'record',
                },
                hasValue: true,
              },
              hasValue: true,
            },
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
});
