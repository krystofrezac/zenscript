import { expect, test } from 'vitest';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';
import { getAst } from '../getAst';

test('empty tuple', () => {
  const input = '()';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [{ name: AstNodeName.TupleExpression, items: [] }],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('one item tuple', () => {
  const input = '(1)';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.TupleExpression,
        items: [{ name: AstNodeName.NumberExpression, value: 1 }],
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('multiple items tuple', () => {
  const input = '(1, "", (1))';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.TupleExpression,
        items: [
          { name: AstNodeName.NumberExpression, value: 1 },
          { name: AstNodeName.StringExpression, value: '' },
          {
            name: AstNodeName.TupleExpression,
            items: [{ name: AstNodeName.NumberExpression, value: 1 }],
          },
        ],
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('tuple assigned to variable', () => {
  const input = 'a = (1)';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        expression: {
          name: AstNodeName.TupleExpression,
          items: [{ name: AstNodeName.NumberExpression, value: 1 }],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('tuple assigned to variable with same explicit type', () => {
  const input = 'a: (number) = (1)';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        type: {
          name: AstNodeName.TupleType,
          items: [{ name: AstNodeName.NumberType }],
        },
        expression: {
          name: AstNodeName.TupleExpression,
          items: [{ name: AstNodeName.NumberExpression, value: 1 }],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('tuple assigned to variable with different explicit type', () => {
  const input = 'a: number = (1)';
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'a',
        type: { name: AstNodeName.NumberType },
        expression: {
          name: AstNodeName.TupleExpression,
          items: [{ name: AstNodeName.NumberExpression, value: 1 }],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
