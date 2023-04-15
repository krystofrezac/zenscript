import { expect, test } from 'vitest';
import { codeToAST } from '../../tests/helpers';
import { createAstNode } from '../helpers/createAstNode';
import { AstNodeName } from '../types';

test('empty tuple', () => {
  const input = '()';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [{ name: AstNodeName.Tuple, items: [], hasValue: true }],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('one item tuple', () => {
  const input = '(1)';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Tuple,
        items: [{ name: AstNodeName.Number, hasValue: true }],
        hasValue: true,
      },
    ],
    hasValue: true,
  });
  const result = codeToAST(input);
  expect(result).toEqual(expected);
});
test('multiple items tuple', () => {
  const input = '(1, "", (1))';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.Tuple,
        items: [
          { name: AstNodeName.Number, hasValue: true },
          { name: AstNodeName.String, hasValue: true },
          {
            name: AstNodeName.Tuple,
            items: [{ name: AstNodeName.Number, hasValue: true }],
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
test('tuple assigned to variable', () => {
  const input = 'a = (1)';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        implicitType: {
          name: AstNodeName.Tuple,
          items: [{ name: AstNodeName.Number, hasValue: true }],
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
test('tuple assigned to variable with same explicit type', () => {
  const input = 'a: (number) = (1)';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        explicitType: {
          name: AstNodeName.Tuple,
          items: [{ name: AstNodeName.Number, hasValue: false }],
          hasValue: false,
        },
        implicitType: {
          name: AstNodeName.Tuple,
          items: [{ name: AstNodeName.Number, hasValue: true }],
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
test('tuple assigned to variable with different explicit type', () => {
  const input = 'a: number = (1)';
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [
      {
        name: AstNodeName.VariableAssignment,
        variableName: 'a',
        explicitType: { name: AstNodeName.Number, hasValue: false },
        implicitType: {
          name: AstNodeName.Tuple,
          items: [{ name: AstNodeName.Number, hasValue: true }],
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
