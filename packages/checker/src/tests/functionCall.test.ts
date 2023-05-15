import { describe, expect, test } from 'vitest';
import type { CheckAstResult } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import type { VariableScope } from '../types';
import { testCheckAst } from './helpers';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = `
          a = ()1
          b = a() 
        `;
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('value assignment with correct explicit type', () => {
    const input = `
          a = ()1
          b: number = a() 
        `;
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('value assignment with incorrect explicit type', () => {
    const input = `
          a = ()1
          b: string = a() 
        `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'b',
            expected: {
              name: AstCheckerTypeNames.String,
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Number,
              hasValue: true,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('calling higher order function', () => {
    const input = `
          a = ()()()1
          b: number = a()()()
        `;
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('partially calling higher order function', () => {
    const input = `
          a = ()()()1
          b: ()number = a()()
        `;
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('calling non callable expression', () => {
    const input = `
          a = 1
          b = a()
        `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.CallingNonCallableExpression,
          data: {
            callee: {
              name: AstCheckerTypeNames.Number,
              hasValue: true,
            },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('calling expression without value', () => {
    const input = `
          a: number
          b = a()
        `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: AstCheckerTypeNames.Number,
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
});
describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = 'a: string = stringFunction("")';
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: [
            {
              name: AstCheckerTypeNames.String,
              hasValue: true,
            },
          ],
          return: {
            name: AstCheckerTypeNames.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = 'a: string = stringNumberNumberFunction("", 1, 2)';
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: [
            {
              name: AstCheckerTypeNames.String,
              hasValue: true,
            },
            {
              name: AstCheckerTypeNames.Number,
              hasValue: true,
            },
            {
              name: AstCheckerTypeNames.Number,
              hasValue: true,
            },
          ],
          return: { name: AstCheckerTypeNames.String, hasValue: true },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = {
      errors: [],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(result).toEqual(expected);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = 'a: string = stringFunction()';
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: [
            {
              name: AstCheckerTypeNames.String,
              hasValue: true,
            },
          ],
          return: { name: AstCheckerTypeNames.String, hasValue: true },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.FunctionParametersMismatch,
          data: {
            expected: [{ name: AstCheckerTypeNames.String, hasValue: true }],
            received: [],
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(result).toEqual(expected);
  });
});
