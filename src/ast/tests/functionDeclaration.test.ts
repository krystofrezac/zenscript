import { describe, expect, test } from 'vitest';
import { codeToAST } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('value', () => {
  test('without parameters', () => {
    const input = '() 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionDeclaration,
          parameters: {
            name: AstNodeName.Tuple,
            items: [],
            hasValue: true,
          },
          return: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('with parameters', () => {
    const input = '(a, b) b';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionDeclaration,
          parameters: {
            name: AstNodeName.Tuple,
            items: [
              {
                name: AstNodeName.Parameter,
                parameterName: 'a',
                hasValue: true,
              },
              {
                name: AstNodeName.Parameter,
                parameterName: 'b',
                hasValue: true,
              },
            ],
            hasValue: true,
          },
          return: {
            name: AstNodeName.VariableReference,
            variableName: 'b',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = codeToAST(input);
    expect(result).toEqual(expected);
  });
  test('with complex return', () => {
    const input = `
      (a, b) {
        c = a
        c
      }
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionDeclaration,
          parameters: {
            name: AstNodeName.Tuple,
            items: [
              {
                name: AstNodeName.Parameter,
                parameterName: 'a',
                hasValue: true,
              },
              {
                name: AstNodeName.Parameter,
                parameterName: 'b',
                hasValue: true,
              },
            ],
            hasValue: true,
          },
          return: {
            name: AstNodeName.Block,
            children: [
              {
                name: AstNodeName.VariableAssignment,
                variableName: 'c',
                implicitType: {
                  name: AstNodeName.VariableReference,
                  variableName: 'a',
                },
                hasValue: true,
              },
              {
                name: AstNodeName.VariableReference,
                variableName: 'c',
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
});

describe('type', () => {
  test('without parameters', () => {
    const input = 'a: () number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: {
            name: AstNodeName.FunctionDeclaration,
            parameters: {
              name: AstNodeName.Tuple,
              items: [],
              hasValue: false,
            },
            return: { name: AstNodeName.Number, hasValue: false },
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
  test('with simple parameters', () => {
    const input = 'a: (number) number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: {
            name: AstNodeName.FunctionDeclaration,
            parameters: {
              name: AstNodeName.Tuple,
              items: [
                {
                  name: AstNodeName.Number,
                  hasValue: false,
                },
              ],
              hasValue: false,
            },
            return: { name: AstNodeName.Number, hasValue: false },
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
  test('with generic parameters', () => {
    const input = "a: ('a) 'a";
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: {
            name: AstNodeName.FunctionDeclaration,
            parameters: {
              name: AstNodeName.Tuple,
              items: [
                {
                  name: AstNodeName.Generic,
                  genericName: 'a',
                  hasValue: false,
                },
              ],
              hasValue: false,
            },
            return: {
              name: AstNodeName.Generic,
              genericName: 'a',
              hasValue: false,
            },
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
