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
          filePath: './ahoj',
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
