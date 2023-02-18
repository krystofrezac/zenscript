import { describe, expect, test } from 'vitest';
import { getTypeTree } from '.';
import { parse } from '../parser';
import { createSemantics } from '../semantics';
import { createTypeTreeNode } from './helpers/createTypeTreeNode';
import { TypeTreeNodeName } from './types';

const semantics = createSemantics();
const getTree = (input: string) => {
  const adapter = semantics(parse(input));

  return getTypeTree(adapter);
};

describe('empty', () => {
  const expected = createTypeTreeNode({
    name: TypeTreeNodeName.Block,
    children: [],
    hasValue: true,
  });
  test('empty string', () => {
    const input = '';
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string with spaces', () => {
    const input = '   ';
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});
describe('string', () => {
  test('only string', () => {
    const input = '"Hello, World!"';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [{ name: TypeTreeNodeName.String, hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable', () => {
    const input = 'a = "Hello, World!"';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.String, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with same explicit type', () => {
    const input = 'a: string = "Hello, World!"';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.String, hasValue: true },
          explicitTypeNode: { name: TypeTreeNodeName.String, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string assigned to variable with different explicit type', () => {
    const input = 'a: number = "Hello, World!"';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.String, hasValue: true },
          explicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('string type assigned to variable', () => {
    const input = 'a: string';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          explicitTypeNode: { name: TypeTreeNodeName.String, hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('number', () => {
  test('only number', () => {
    const input = '1';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [{ name: TypeTreeNodeName.Number, hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable', () => {
    const input = 'a = 1';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: true },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with same explicit type', () => {
    const input = 'a: number = 1';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: true },
          explicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number assigned to variable with different explicit type', () => {
    const input = 'a: string = 1';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: true },
          explicitTypeNode: { name: TypeTreeNodeName.String, hasValue: false },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('number type assigned to variable', () => {
    const input = 'a: number';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          explicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: false },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('variable reference', () => {
  test('referencing value', () => {
    const input = `
      a = 1
      b = a
    `;
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'b',
          implicitTypeNode: {
            name: TypeTreeNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('referencing type', () => {
    const input = `
      a = 1
      b: a 
    `;
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'b',
          explicitTypeNode: {
            name: TypeTreeNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: false,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('referencing value and type', () => {
    const input = `
      a = 1
      b: number
      c: b = a
    `;
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: true },
          hasValue: true,
        },
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'b',
          explicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: false },
          hasValue: false,
        },
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'c',
          explicitTypeNode: {
            name: TypeTreeNodeName.VariableReference,
            variableName: 'b',
          },
          implicitTypeNode: {
            name: TypeTreeNodeName.VariableReference,
            variableName: 'a',
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('block', () => {
  test('empty block', () => {
    const input = '{}';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        { name: TypeTreeNodeName.Block, children: [], hasValue: true },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block with string value', () => {
    const input = '{""}';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.Block,
          children: [{ name: TypeTreeNodeName.String, hasValue: true }],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block with number value', () => {
    const input = '{1}';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.Block,
          children: [{ name: TypeTreeNodeName.Number, hasValue: true }],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block with variable assignments', () => {
    const input = `{
      a = 1
      b = 2
      b
    }`;
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.Block,
          children: [
            {
              name: TypeTreeNodeName.VariableAssignment,
              variableName: 'a',
              implicitTypeNode: {
                name: TypeTreeNodeName.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            {
              name: TypeTreeNodeName.VariableAssignment,
              variableName: 'b',
              implicitTypeNode: {
                name: TypeTreeNodeName.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            {
              name: TypeTreeNodeName.VariableReference,
              variableName: 'b',
            },
          ],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('block assigned to variable', () => {
    const input = 'a = {1}';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: {
            name: TypeTreeNodeName.Block,
            children: [{ name: TypeTreeNodeName.Number, hasValue: true }],
            hasValue: true,
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
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
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.Block,
          children: [
            {
              name: TypeTreeNodeName.VariableAssignment,
              variableName: 'a',
              implicitTypeNode: {
                name: TypeTreeNodeName.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            {
              name: TypeTreeNodeName.Block,
              children: [
                {
                  name: TypeTreeNodeName.VariableAssignment,
                  variableName: 'a',
                  implicitTypeNode: {
                    name: TypeTreeNodeName.String,
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
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('tuple', () => {
  test('empty tuple', () => {
    const input = '()';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [{ name: TypeTreeNodeName.Tuple, items: [], hasValue: true }],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('one item tuple', () => {
    const input = '(1)';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.Tuple,
          items: [{ name: TypeTreeNodeName.Number, hasValue: true }],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('multiple items tuple', () => {
    const input = '(1, "", (1))';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.Tuple,
          items: [
            { name: TypeTreeNodeName.Number, hasValue: true },
            { name: TypeTreeNodeName.String, hasValue: true },
            {
              name: TypeTreeNodeName.Tuple,
              items: [{ name: TypeTreeNodeName.Number, hasValue: true }],
              hasValue: true,
            },
          ],
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('tuple assigned to variable', () => {
    const input = 'a = (1)';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          implicitTypeNode: {
            name: TypeTreeNodeName.Tuple,
            items: [{ name: TypeTreeNodeName.Number, hasValue: true }],
            hasValue: true,
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('tuple assigned to variable with same explicit type', () => {
    const input = 'a: (number) = (1)';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          explicitTypeNode: {
            name: TypeTreeNodeName.Tuple,
            items: [{ name: TypeTreeNodeName.Number, hasValue: false }],
            hasValue: false,
          },
          implicitTypeNode: {
            name: TypeTreeNodeName.Tuple,
            items: [{ name: TypeTreeNodeName.Number, hasValue: true }],
            hasValue: true,
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
  test('tuple assigned to variable with different explicit type', () => {
    const input = 'a: number = (1)';
    const expected = createTypeTreeNode({
      name: TypeTreeNodeName.Block,
      children: [
        {
          name: TypeTreeNodeName.VariableAssignment,
          variableName: 'a',
          explicitTypeNode: { name: TypeTreeNodeName.Number, hasValue: false },
          implicitTypeNode: {
            name: TypeTreeNodeName.Tuple,
            items: [{ name: TypeTreeNodeName.Number, hasValue: true }],
            hasValue: true,
          },
          hasValue: true,
        },
      ],
      hasValue: true,
    });
    const result = getTree(input);
    expect(result).toEqual(expected);
  });
});

describe('function', () => {
  describe('value', () => {
    test('without parameters', () => {
      const input = '() 1';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.FunctionDeclaration,
            parameters: {
              name: TypeTreeNodeName.Tuple,
              items: [],
              hasValue: true,
            },
            return: { name: TypeTreeNodeName.Number, hasValue: true },
            hasValue: true,
          },
        ],
        hasValue: true,
      });
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('with parameters', () => {
      const input = '(a, b) b';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.FunctionDeclaration,
            parameters: {
              name: TypeTreeNodeName.Tuple,
              items: [
                {
                  name: TypeTreeNodeName.Parameter,
                  parameterName: 'a',
                },
                {
                  name: TypeTreeNodeName.Parameter,
                  parameterName: 'b',
                },
              ],
              hasValue: true,
            },
            return: {
              name: TypeTreeNodeName.VariableReference,
              variableName: 'b',
            },
            hasValue: true,
          },
        ],
        hasValue: true,
      });
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('with complex return', () => {
      const input = `
      (a, b) {
        c = a
        c
      }
    `;
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.FunctionDeclaration,
            parameters: {
              name: TypeTreeNodeName.Tuple,
              items: [
                {
                  name: TypeTreeNodeName.Parameter,
                  parameterName: 'a',
                },
                {
                  name: TypeTreeNodeName.Parameter,
                  parameterName: 'b',
                },
              ],
              hasValue: true,
            },
            return: {
              name: TypeTreeNodeName.Block,
              children: [
                {
                  name: TypeTreeNodeName.VariableAssignment,
                  variableName: 'c',
                  implicitTypeNode: {
                    name: TypeTreeNodeName.VariableReference,
                    variableName: 'a',
                  },
                  hasValue: true,
                },
                {
                  name: TypeTreeNodeName.VariableReference,
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
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
  });

  describe('type', () => {
    test('without parameters', () => {
      const input = 'a: () number';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.VariableAssignment,
            variableName: 'a',
            explicitTypeNode: {
              name: TypeTreeNodeName.FunctionDeclaration,
              parameters: {
                name: TypeTreeNodeName.Tuple,
                items: [],
                hasValue: false,
              },
              return: { name: TypeTreeNodeName.Number, hasValue: false },
              hasValue: false,
            },
            hasValue: false,
          },
        ],
        hasValue: true,
      });
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('with simple parameters', () => {
      const input = 'a: (number) number';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.VariableAssignment,
            variableName: 'a',
            explicitTypeNode: {
              name: TypeTreeNodeName.FunctionDeclaration,
              parameters: {
                name: TypeTreeNodeName.Tuple,
                items: [
                  {
                    name: TypeTreeNodeName.Number,
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              return: { name: TypeTreeNodeName.Number, hasValue: false },
              hasValue: false,
            },
            hasValue: false,
          },
        ],
        hasValue: true,
      });
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('with generic parameters', () => {
      const input = "a: ('a) 'a";
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.VariableAssignment,
            variableName: 'a',
            explicitTypeNode: {
              name: TypeTreeNodeName.FunctionDeclaration,
              parameters: {
                name: TypeTreeNodeName.Tuple,
                items: [
                  {
                    name: TypeTreeNodeName.Generic,
                    genericName: 'a',
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              return: {
                name: TypeTreeNodeName.Generic,
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
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
  });
});

describe('function call', () => {
  describe('value', () => {
    test('without parameters', () => {
      const input = 'a()';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.FunctionCall,
            callee: {
              name: TypeTreeNodeName.VariableReference,
              variableName: 'a',
            },
            arguments: {
              name: TypeTreeNodeName.Tuple,
              items: [],
              hasValue: true,
            },
            hasValue: true,
          },
        ],
        hasValue: true,
      });
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('with parameters', () => {
      const input = 'a(1)';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.FunctionCall,
            callee: {
              name: TypeTreeNodeName.VariableReference,
              variableName: 'a',
            },
            arguments: {
              name: TypeTreeNodeName.Tuple,
              items: [
                {
                  name: TypeTreeNodeName.Number,
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
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('chained', () => {
      const input = 'a()()';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.FunctionCall,
            callee: {
              name: TypeTreeNodeName.FunctionCall,
              callee: {
                name: TypeTreeNodeName.VariableReference,
                variableName: 'a',
              },
              arguments: {
                name: TypeTreeNodeName.Tuple,
                items: [],
                hasValue: true,
              },
              hasValue: true,
            },
            arguments: {
              name: TypeTreeNodeName.Tuple,
              items: [],
              hasValue: true,
            },
            hasValue: true,
          },
        ],
        hasValue: true,
      });
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
  });

  describe('type', () => {
    test('without parameters', () => {
      const input = 'a: b()';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.VariableAssignment,
            variableName: 'a',
            explicitTypeNode: {
              name: TypeTreeNodeName.FunctionCall,
              callee: {
                name: TypeTreeNodeName.VariableReference,
                variableName: 'b',
              },
              arguments: {
                name: TypeTreeNodeName.Tuple,
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
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('with parameters', () => {
      const input = 'a: b(number)';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.VariableAssignment,
            variableName: 'a',
            explicitTypeNode: {
              name: TypeTreeNodeName.FunctionCall,
              callee: {
                name: TypeTreeNodeName.VariableReference,
                variableName: 'b',
              },
              arguments: {
                name: TypeTreeNodeName.Tuple,
                items: [
                  {
                    name: TypeTreeNodeName.Number,
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
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
    test('chained', () => {
      const input = 'a: b()()';
      const expected = createTypeTreeNode({
        name: TypeTreeNodeName.Block,
        children: [
          {
            name: TypeTreeNodeName.VariableAssignment,
            variableName: 'a',
            explicitTypeNode: {
              name: TypeTreeNodeName.FunctionCall,
              callee: {
                name: TypeTreeNodeName.FunctionCall,
                callee: {
                  name: TypeTreeNodeName.VariableReference,
                  variableName: 'b',
                },
                arguments: {
                  name: TypeTreeNodeName.Tuple,
                  items: [],
                  hasValue: false,
                },
                hasValue: false,
              },
              arguments: {
                name: TypeTreeNodeName.Tuple,
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
      const result = getTree(input);
      expect(result).toEqual(expected);
    });
  });
});
