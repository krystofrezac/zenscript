import { expect, test } from 'vitest';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';
import { getAst } from '../getAst';

test('export', () => {
  const input = `
    export myVar: string = "content"
    export myFun = () 1
  `;
  const expected = createAstNode({
    name: AstNodeName.File,
    children: [
      {
        name: AstNodeName.ExportedVariableAssignment,
        variableAssignment: {
          name: AstNodeName.VariableAssignment,
          identifierName: 'myVar',
          type: {
            name: AstNodeName.StringType,
          },
          expression: {
            name: AstNodeName.StringExpression,
            value: 'content',
          },
        },
      },
      {
        name: AstNodeName.ExportedVariableAssignment,
        variableAssignment: {
          name: AstNodeName.VariableAssignment,
          identifierName: 'myFun',
          expression: {
            name: AstNodeName.FunctionDeclarationExpression,
            parameters: [],
            return: { name: AstNodeName.NumberExpression, value: 1 },
          },
        },
      },
    ],
  });
  const result = getAst(input);
  expect(result).toEqual(expected);
});
