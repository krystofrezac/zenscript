import { describe, expect, test } from 'vitest';
import { CheckAstReturn, checkAST } from '..';
import { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { codeToAST } from './utils';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = codeToAST(`
          a = ()1
          b = a() 
        `);
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('value assignment with correct explicit type', () => {
    const input = codeToAST(`
          a = ()1
          b: number = a() 
        `);
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('value assignment with incorrect explicit type', () => {
    const input = codeToAST(`
          a = ()1
          b: string = a() 
        `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'b',
            expected: {
              name: CheckerTypeNames.String,
              hasValue: false,
            },
            received: {
              name: CheckerTypeNames.Number,
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('calling higher order function', () => {
    const input = codeToAST(`
          a = ()()()1
          b: number = a()()()
        `);
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('partially calling higher order function', () => {
    const input = codeToAST(`
          a = ()()()1
          b: ()number = a()()
        `);
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('calling non callable expression', () => {
    const input = codeToAST(`
          a = 1
          b = a()
        `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.CallingNonCallableExpression,
          data: {
            callee: {
              name: CheckerTypeNames.Number,
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('calling expression without value', () => {
    const input = codeToAST(`
          a: number
          b = a()
        `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: CheckerTypeNames.Number,
              hasValue: false,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = codeToAST('a: string = stringFunction("")');
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: CheckerTypeNames.Function,
          parameters: {
            name: CheckerTypeNames.Tuple,
            items: [
              {
                name: CheckerTypeNames.String,
                hasValue: true,
              },
            ],
            hasValue: true,
          },
          return: {
            name: CheckerTypeNames.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = codeToAST('a: string = stringNumberNumberFunction("", 1, 2)');
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: CheckerTypeNames.Function,
          parameters: {
            name: CheckerTypeNames.Tuple,
            items: [
              {
                name: CheckerTypeNames.String,
                hasValue: true,
              },
              {
                name: CheckerTypeNames.Number,
                hasValue: true,
              },
              {
                name: CheckerTypeNames.Number,
                hasValue: true,
              },
            ],
            hasValue: true,
          },
          return: { name: CheckerTypeNames.String, hasValue: true },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = codeToAST('a: string = stringFunction()');
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: CheckerTypeNames.Function,
          parameters: {
            name: CheckerTypeNames.Tuple,
            items: [
              {
                name: CheckerTypeNames.String,
                hasValue: true,
              },
            ],
            hasValue: true,
          },
          return: { name: CheckerTypeNames.String, hasValue: true },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.FunctionParametersMismatch,
          data: {
            expected: {
              name: CheckerTypeNames.Tuple,
              items: [{ name: CheckerTypeNames.String, hasValue: true }],
              hasValue: true,
            },
            received: {
              name: CheckerTypeNames.Tuple,
              items: [],
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAST(input, defaultVariables);
    expect(result).toEqual(expected);
  });
});
