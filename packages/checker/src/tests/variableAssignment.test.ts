import { describe, test, expect } from 'vitest';
import type { CheckAstResult } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeName } from '../types/types';
import { ignoreAstCheckerNode } from '../nodeCheckers/helpers/ignoreAstCheckerNode';
import { testCheckAst } from './helpers';

describe('non type checks', () => {
  test('assigning expression', () => {
    const input = 'a = 1';
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning existing variable', () => {
    const input = `
      a = 1
      b = a
    `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning non-existing variable', () => {
    const input = 'b = a';
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.UnknownIdentifier,
          data: { identifier: 'a' },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('redeclaring variable in the same scope', () => {
    const input = `
      a = 1
      a = 2
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
          data: { identifier: 'a' },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('redeclaring variable in different scope', () => {
    const input = `
      a = 1
      {
        a = 2
      }
    `;
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning variable without value', () => {
    const input = `
      a: number 
      b = a
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: AstCheckerTypeName.Number,
              hasValue: false,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning variable with value', () => {
    const input = `
      a: number = 1
      b = a
    `;
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});

describe('basic type checks', () => {
  test('assigning same value and type', () => {
    const input = 'a: number = 1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning different value and type', () => {
    const input = 'a: string = 1';
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: AstCheckerTypeName.String, hasValue: false },
            received: { name: AstCheckerTypeName.Number, hasValue: true },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('assigning different value and type and then assigning again', () => {
    const input = `
      a: string = 1
      b: string = a 
      `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: AstCheckerTypeName.String, hasValue: false },
            received: { name: AstCheckerTypeName.Number, hasValue: true },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});

describe('exports', () => {
  test('single top level export', () => {
    const input = 'export myVar = 1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [
        {
          variableName: 'myVar',
          variableType: {
            name: AstCheckerTypeName.Number,
            hasValue: true,
          },
        },
      ],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('multiple top level exports', () => {
    const input = `
      export a = 1
      export b = ""
      export c = b
    `;
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [
        {
          variableName: 'a',
          variableType: {
            name: AstCheckerTypeName.Number,
            hasValue: true,
          },
        },
        {
          variableName: 'b',
          variableType: {
            name: AstCheckerTypeName.String,
            hasValue: true,
          },
        },
        {
          variableName: 'c',
          variableType: {
            name: AstCheckerTypeName.String,
            hasValue: true,
          },
        },
      ],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('nested export', () => {
    const input = `
      export a = 1
      export b = {
        export c = ""
        c
      }
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.NestedExport,
          data: {},
        },
      ],
      exportedVariables: [
        {
          variableName: 'a',
          variableType: {
            name: AstCheckerTypeName.Number,
            hasValue: true,
          },
        },
        {
          variableName: 'b',
          variableType: ignoreAstCheckerNode,
        },
      ],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});
