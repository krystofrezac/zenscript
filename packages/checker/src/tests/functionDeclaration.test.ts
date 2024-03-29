import { describe, expect, test } from 'vitest';
import type { CheckAstResult } from '..';
import type { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeName } from '../types/types';
import { testCheckAst } from './helpers';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = 'a = () 1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(expected).toEqual(result);
  });
  test('type assignment', () => {
    const input = 'a : () number';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(expected).toEqual(result);
  });
  test('assigning value and same explicit type', () => {
    const input = 'a : () number = () 1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(expected).toEqual(result);
  });
  test('assigning value and explicit type with different return', () => {
    const input = 'a : () string = () 1';
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            expected: {
              name: AstCheckerTypeName.Function,
              parameters: [],
              return: {
                name: AstCheckerTypeName.String,
                hasValue: false,
              },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeName.Function,
              parameters: [],
              return: {
                name: AstCheckerTypeName.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            variableName: 'a',
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(expected).toEqual(result);
  });
  test('propagating errors from function body', () => {
    const input = 'a = () b';
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.UnknownIdentifier,
          data: {
            identifier: 'b',
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('higher order function', () => {
    const input = 'a: ()()()number = ()()()1';
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
});

describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = `
          a: (string) string = (param) stringFunction(param)
        `;
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeName.Function,
          parameters: [{ name: AstCheckerTypeName.String, hasValue: true }],
          return: {
            name: AstCheckerTypeName.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    console.log(JSON.stringify(result.errors, null, 2));
    expect(result).toEqual(expected);
  });
  test('single parameter - indirect usage', () => {
    const input = `
          a : (string) string 
            = (param) {
              variable = param
              stringFunction(variable)
            }
        `;
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeName.Function,
          parameters: [{ name: AstCheckerTypeName.String, hasValue: true }],
          return: {
            name: AstCheckerTypeName.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = `
          a: (string, number, number) string 
           = (paramA, paramB, paramC) stringNumberNumberFunction(paramA, paramB, paramC)
        `;
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: AstCheckerTypeName.Function,
          parameters: [
            { name: AstCheckerTypeName.String, hasValue: true },
            { name: AstCheckerTypeName.Number, hasValue: true },
            { name: AstCheckerTypeName.Number, hasValue: true },
          ],
          return: {
            name: AstCheckerTypeName.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = { errors: [], exportedVariables: [] };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(expected).toEqual(result);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = `
          a: (string, number, number) string 
           = (paramA, paramB) stringNumberNumberFunction(paramA, paramB)
        `;
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: AstCheckerTypeName.Function,
          parameters: [
            { name: AstCheckerTypeName.String, hasValue: true },
            { name: AstCheckerTypeName.Number, hasValue: true },
          ],
          return: {
            name: AstCheckerTypeName.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: {
              name: AstCheckerTypeName.Function,
              parameters: [
                {
                  name: AstCheckerTypeName.String,
                  hasValue: false,
                },
                {
                  name: AstCheckerTypeName.Number,
                  hasValue: false,
                },
                {
                  name: AstCheckerTypeName.Number,
                  hasValue: false,
                },
              ],
              return: { name: AstCheckerTypeName.String, hasValue: false },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeName.Function,
              parameters: [
                {
                  name: AstCheckerTypeName.String,
                  hasValue: true,
                },
                {
                  name: AstCheckerTypeName.Number,
                  hasValue: true,
                },
              ],
              return: { name: AstCheckerTypeName.String, hasValue: true },
              hasValue: true,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(expected).toEqual(result);
  });
  test('multiple parameters with same name', () => {
    const input = 'a = (paramA, paramA) fun(paramA, paramA)';
    const defaultVariables: VariableScope = [
      {
        variableName: 'fun',
        variableType: {
          name: AstCheckerTypeName.Function,
          parameters: [
            {
              name: AstCheckerTypeName.String,
              hasValue: true,
            },
            {
              name: AstCheckerTypeName.String,
              hasValue: true,
            },
          ],
          return: { name: AstCheckerTypeName.String, hasValue: true },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
          data: {
            identifier: 'paramA',
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(result).toEqual(expected);
  });
});
