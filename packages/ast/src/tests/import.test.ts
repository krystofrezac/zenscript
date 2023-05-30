import { expect, test } from 'vitest';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';
import { getAst } from '../getAst';

test('correct import expression', () => {
  const input = `imported = import("./ahoj")`;
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'imported',
        expression: {
          name: AstNodeName.ImportExpression,
          parameters: [{ name: AstNodeName.StringExpression, value: './ahoj' }],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
test('incorrect import expression', () => {
  const input = `imported = import(%{}, 1)`;
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        identifierName: 'imported',
        expression: {
          name: AstNodeName.ImportExpression,
          parameters: [
            { name: AstNodeName.RecordExpression, entries: [] },
            { name: AstNodeName.NumberExpression, value: 1 },
          ],
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
