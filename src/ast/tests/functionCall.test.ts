import { describe, expect, test } from 'vitest';
import { codeToAST } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

describe('value', () => {
  test('without parameters', () => {
    const input = 'a()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionCall,
          callee: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          arguments: {
            name: AstNodeName.Tuple,
            items: [],
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
  test('with parameters', () => {
    const input = 'a(1)';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionCall,
          callee: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          arguments: {
            name: AstNodeName.Tuple,
            items: [
              {
                name: AstNodeName.Number,
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
  test('chained', () => {
    const input = 'a()()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.FunctionCall,
          callee: {
            name: AstNodeName.FunctionCall,
            callee: {
              name: AstNodeName.VariableReference,
              variableName: 'a',
            },
            arguments: {
              name: AstNodeName.Tuple,
              items: [],
              hasValue: true,
            },
            hasValue: true,
          },
          arguments: {
            name: AstNodeName.Tuple,
            items: [],
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
    const input = 'a: b()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: {
            name: AstNodeName.FunctionCall,
            callee: {
              name: AstNodeName.VariableReference,
              variableName: 'b',
            },
            arguments: {
              name: AstNodeName.Tuple,
              items: [],
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
  test('with parameters', () => {
    const input = 'a: b(number)';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: {
            name: AstNodeName.FunctionCall,
            callee: {
              name: AstNodeName.VariableReference,
              variableName: 'b',
            },
            arguments: {
              name: AstNodeName.Tuple,
              items: [
                {
                  name: AstNodeName.Number,
                  hasValue: false,
                },
              ],
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
  test('chained', () => {
    const input = 'a: b()()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: {
            name: AstNodeName.FunctionCall,
            callee: {
              name: AstNodeName.FunctionCall,
              callee: {
                name: AstNodeName.VariableReference,
                variableName: 'b',
              },
              arguments: {
                name: AstNodeName.Tuple,
                items: [],
                hasValue: false,
              },
              hasValue: false,
            },
            arguments: {
              name: AstNodeName.Tuple,
              items: [],
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
