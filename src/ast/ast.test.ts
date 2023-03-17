import { describe, expect, test } from 'vitest';
import { getAST } from '.';
import { parse } from '../parser';
import { createAstNode } from './helpers/createAstNode';
import { AstNodeName } from './types';

const getResult = (input: string) => {
  const parsedInput = parse(input);
  return getAST(parsedInput);
};

describe('empty', () => {
  const expected = createAstNode({
    name: AstNodeName.Block,
    children: [],
    hasValue: true,
  });
  test('empty string', () => {
    const input = '';
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('string with spaces', () => {
    const input = '   ';
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
});
describe('string', () => {
  test('only string', () => {
    const input = '"Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.String, hasValue: true }],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable', () => {
    const input = 'a = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.String, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with same explicit type', () => {
    const input = 'a: string = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.String, hasValue: true },
          explicitType: { name: AstNodeName.String, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with different explicit type', () => {
    const input = 'a: number = "Hello, World!"';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.String, hasValue: true },
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('string type assigned to variable', () => {
    const input = 'a: string';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: { name: AstNodeName.String, hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
});

describe('number', () => {
  test('only number', () => {
    const input = '1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.Number, hasValue: true }],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable', () => {
    const input = 'a = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with same explicit type', () => {
    const input = 'a: number = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with different explicit type', () => {
    const input = 'a: string = 1';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          explicitType: { name: AstNodeName.String, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('number type assigned to variable', () => {
    const input = 'a: number';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
});

describe('variable reference', () => {
  test('referencing value', () => {
    const input = `
      a = 1
      b = a
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'b',
          implicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('referencing type', () => {
    const input = `
      a = 1
      b: a 
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'b',
          explicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
  test('referencing value and type', () => {
    const input = `
      a = 1
      b: number
      c: b = a
    `;
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'a',
          implicitType: { name: AstNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'b',
          explicitType: { name: AstNodeName.Number, hasValue: false },
          hasValue: false,
        },
        {
          name: AstNodeName.VariableAssignment,
          variableName: 'c',
          explicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'b',
          },
          implicitType: {
            name: AstNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
});

describe('block', () => {
  test('empty block', () => {
    const input = '{}';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.Block, children: [], hasValue: true }],
      hasValue: true,
    });
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
});

describe('tuple', () => {
  test('empty tuple', () => {
    const input = '()';
    const expected = createAstNode({
      name: AstNodeName.Block,
      children: [{ name: AstNodeName.Tuple, items: [], hasValue: true }],
      hasValue: true,
    });
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
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
    const result = getResult(input);
    expect(result).toEqual(expected);
  });
});

describe('function', () => {
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
      const result = getResult(input);
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
                },
                {
                  name: AstNodeName.Parameter,
                  parameterName: 'b',
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
      const result = getResult(input);
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
                },
                {
                  name: AstNodeName.Parameter,
                  parameterName: 'b',
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
      const result = getResult(input);
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
      const result = getResult(input);
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
      const result = getResult(input);
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
      const result = getResult(input);
      expect(result).toEqual(expected);
    });
  });
});

describe('function call', () => {
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
      const result = getResult(input);
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
      const result = getResult(input);
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
      const result = getResult(input);
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
      const result = getResult(input);
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
      const result = getResult(input);
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
      const result = getResult(input);
      expect(result).toEqual(expected);
    });
  });
});
