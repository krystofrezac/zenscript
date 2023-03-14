import { describe, expect, test } from 'vitest';
import { CheckTypeTreeReturn, checkTypeTree } from '..';
import { VariableScope } from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { getInput } from './utils';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = getInput(`
          a = ()1
          b = a() 
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('value assignment with correct explicit type', () => {
    const input = getInput(`
          a = ()1
          b: number = a() 
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('value assignment with incorrect explicit type', () => {
    const input = getInput(`
          a = ()1
          b: string = a() 
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [
        {
          name: TypeTreeCheckerErrorName.VariableTypeMismatch,
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
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('calling higher order function', () => {
    const input = getInput(`
          a = ()()()1
          b: number = a()()()
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('partially calling higher order function', () => {
    const input = getInput(`
          a = ()()()1
          b: ()number = a()()
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('calling non callable expression', () => {
    const input = getInput(`
          a = 1
          b = a()
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [
        {
          name: TypeTreeCheckerErrorName.CallingNonCallableExpression,
          data: {
            callee: {
              name: CheckerTypeNames.Number,
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('calling expression without value', () => {
    const input = getInput(`
          a: number
          b = a()
        `);
    const expected: CheckTypeTreeReturn = {
      errors: [
        {
          name: TypeTreeCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: CheckerTypeNames.Number,
              hasValue: false,
            },
          },
        },
      ],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
});
describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = getInput('a: string = stringFunction("")');
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
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = getInput('a: string = stringNumberNumberFunction("", 1, 2)');
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
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = getInput('a: string = stringFunction()');
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
    const expected: CheckTypeTreeReturn = {
      errors: [
        {
          name: TypeTreeCheckerErrorName.FunctionParametersMismatch,
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
    const result = checkTypeTree(input, defaultVariables);
    expect(result).toEqual(expected);
  });
});
