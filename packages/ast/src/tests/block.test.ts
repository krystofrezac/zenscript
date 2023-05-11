import { expect, test } from 'vitest';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';
import { getAst } from '../getAst';

test('empty block', () => {
  const input = '{}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [{ name: AstNodeName.Block, children: [] }],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('block with string value', () => {
  const input = '{""}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Block,
        children: [{ name: AstNodeName.StringExpression, value: '' }],
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('block with number value', () => {
  const input = '{1}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Block,
        children: [{ name: AstNodeName.NumberExpression, value: 1 }],
      },
    ],
  });
  const result = getAst(input);
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
            identifierName: 'a',
            expression: {
              name: AstNodeName.NumberExpression,
              value: 1,
            },
          },
          {
            name: AstNodeName.VariableAssignment,
            identifierName: 'b',
            expression: {
              name: AstNodeName.NumberExpression,
              value: 2,
            },
          },
          {
            name: AstNodeName.IdentifierExpression,
            identifierName: 'b',
          },
        ],
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('block assigned to variable', () => {
  const input = 'a = {1}';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        expression: {
          name: AstNodeName.Block,
          children: [{ name: AstNodeName.NumberExpression, value: 1 }],
        },
      },
    ],
  });
  const result = getAst(input);
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
            identifierName: 'a',
            expression: {
              name: AstNodeName.NumberExpression,
              value: 1,
            },
          },
          {
            name: AstNodeName.Block,
            children: [
              {
                name: AstNodeName.VariableAssignment,
                identifierName: 'a',
                expression: {
                  name: AstNodeName.StringExpression,
                  value: 'hello',
                },
              },
            ],
          },
        ],
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
