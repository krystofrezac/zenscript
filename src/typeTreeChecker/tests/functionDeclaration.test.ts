import { describe, expect, test } from 'vitest';
import { CheckTypeTreeReturn, checkTypeTree } from '..';
import { VariableScope } from '../types';
import { TypeTreeCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { getInput } from './utils';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = getInput('a = () 1');
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(expected).toEqual(result);
  });
  test('type assignment', () => {
    const input = getInput('a : () number');
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(expected).toEqual(result);
  });
  test('assigning value and same explicit type', () => {
    const input = getInput('a : () number = () 1');
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(expected).toEqual(result);
  });
  test('assigning value and explicit type with different return', () => {
    const input = getInput('a : () string = () 1');
    const expected: CheckTypeTreeReturn = {
      errors: [
        {
          name: TypeTreeCheckerErrorName.VariableTypeMismatch,
          data: {
            expected: {
              name: CheckerTypeNames.Function,
              parameters: {
                name: CheckerTypeNames.Tuple,
                items: [],
                hasValue: false,
              },
              return: {
                name: CheckerTypeNames.String,
                hasValue: false,
              },
              hasValue: false,
            },
            received: {
              name: CheckerTypeNames.Function,
              parameters: {
                name: CheckerTypeNames.Tuple,
                items: [],
                hasValue: true,
              },
              return: {
                name: CheckerTypeNames.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            variableName: 'a',
          },
        },
      ],
    };
    const result = checkTypeTree(input);
    expect(expected).toEqual(result);
  });
  test('propagating errors from function body', () => {
    const input = getInput('a = () b');
    const expected: CheckTypeTreeReturn = {
      errors: [
        {
          name: TypeTreeCheckerErrorName.UnknownIdentifier,
          data: {
            identifier: 'b',
          },
        },
      ],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
  test('higher order function', () => {
    const input = getInput('a: ()()()number = ()()()1');
    const expected: CheckTypeTreeReturn = {
      errors: [],
    };
    const result = checkTypeTree(input);
    expect(result).toEqual(expected);
  });
});

describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = getInput(`
          a: (string) string = (param) stringFunction(param)
        `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: CheckerTypeNames.Function,
          parameters: {
            name: CheckerTypeNames.Tuple,
            items: [{ name: CheckerTypeNames.String, hasValue: true }],
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
    const expected: CheckTypeTreeReturn = { errors: [] };
    const result = checkTypeTree(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = getInput(`
          a: (string, number, number) string 
           = (paramA, paramB, paramC) stringNumberNumberFunction(paramA, paramB, paramC)
        `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: CheckerTypeNames.Function,
          parameters: {
            name: CheckerTypeNames.Tuple,
            items: [
              { name: CheckerTypeNames.String, hasValue: true },
              { name: CheckerTypeNames.Number, hasValue: true },
              { name: CheckerTypeNames.Number, hasValue: true },
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
    const expected: CheckTypeTreeReturn = { errors: [] };
    const result = checkTypeTree(input, defaultVariables);
    expect(expected).toEqual(result);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = getInput(`
          a: (string, number, number) string 
           = (paramA, paramB) stringNumberNumberFunction(paramA, paramB)
        `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: CheckerTypeNames.Function,
          parameters: {
            name: CheckerTypeNames.Tuple,
            items: [
              { name: CheckerTypeNames.String, hasValue: true },
              { name: CheckerTypeNames.Number, hasValue: true },
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
      errors: [
        {
          name: TypeTreeCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: {
              name: CheckerTypeNames.Function,
              parameters: {
                name: CheckerTypeNames.Tuple,
                items: [
                  {
                    name: CheckerTypeNames.String,
                    hasValue: false,
                  },
                  {
                    name: CheckerTypeNames.Number,
                    hasValue: false,
                  },
                  {
                    name: CheckerTypeNames.Number,
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              return: { name: CheckerTypeNames.String, hasValue: false },
              hasValue: false,
            },
            received: {
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
                ],
                hasValue: true,
              },
              return: { name: CheckerTypeNames.String, hasValue: true },
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkTypeTree(input, defaultVariables);
    expect(expected).toEqual(result);
  });
  test('multiple parameters with same name', () => {
    const input = getInput('a = (paramA, paramA) fun(paramA, paramA)');
    const defaultVariables: VariableScope = [
      {
        variableName: 'fun',
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
          name: TypeTreeCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
          data: {
            identifier: 'paramA',
          },
        },
      ],
    };
    const result = checkTypeTree(input, defaultVariables);
    expect(result).toEqual(expected);
  });
});
