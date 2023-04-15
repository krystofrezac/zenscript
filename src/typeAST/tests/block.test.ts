import { expect, test } from 'vitest';
import { codeToAST } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

test('empty block', () => {
  const input = '{}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [{ name: AstNodeName.Block, children: [], hasValue: true }],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('block with string value', () => {
  const input = '{""}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Block,
        children: [{ name: AstNodeName.String, hasValue: true }],
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('block with number value', () => {
  const input = '{1}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Block,
        children: [{ name: AstNodeName.Number, hasValue: true }],
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('block with variable assignments', () => {
  const input = `{
      a = 1
      b = 2
      b
    }`;
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Block,
        children: [
          {
            name: AstNodeName.VariableAssignment,
            variableName: 'a',
            implicitType: {
              name: AstNodeName.Number,
              hasValue: true,
            },
            hasValue: true,
          },
          {
            name: AstNodeName.VariableAssignment,
            variableName: 'b',
            implicitType: {
              name: AstNodeName.Number,
              hasValue: true,
            },
            hasValue: true,
          },
          {
            name: AstNodeName.VariableReference,
            variableName: 'b',
          },
        ],
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('block assigned to variable', () => {
  const input = 'a = {1}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        implicitType: {
          name: AstNodeName.Block,
          children: [{ name: AstNodeName.Number, hasValue: true }],
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
test('nested blocks', () => {
  const input = `
      {
        a = 1
        {
          a = "hello"
        }
      }
    `;
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Block,
        children: [
          {
            name: AstNodeName.VariableAssignment,
            variableName: 'a',
            implicitType: {
              name: AstNodeName.Number,
              hasValue: true,
            },
            hasValue: true,
          },
          {
            name: AstNodeName.Block,
            children: [
              {
                name: AstNodeName.VariableAssignment,
                variableName: 'a',
                implicitType: {
                  name: AstNodeName.String,
                  hasValue: true,
                },
                hasValue: true,
              },
            ],
            hasValue: true,
          },
        ],
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
