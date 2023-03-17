import { describe, expect, test } from 'vitest';
import { CheckAstReturn, checkAST } from '..';
import { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { CheckerTypeNames } from '../types/types';
import { codeToAST } from './utils';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = codeToAST('a = () 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(expected).toEqual(result);
  });
  test('type assignment', () => {
    const input = codeToAST('a : () number');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(expected).toEqual(result);
  });
  test('assigning value and same explicit type', () => {
    const input = codeToAST('a : () number = () 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(expected).toEqual(result);
  });
  test('assigning value and explicit type with different return', () => {
    const input = codeToAST('a : () string = () 1');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
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
    const result = checkAST(input);
    expect(expected).toEqual(result);
  });
  test('propagating errors from function body', () => {
    const input = codeToAST('a = () b');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.UnknownIdentifier,
          data: {
            identifier: 'b',
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test('higher order function', () => {
    const input = codeToAST('a: ()()()number = ()()()1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});

describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = codeToAST(`
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
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('single parameter - indirect usage', () => {
    const input = codeToAST(`
          a : (string) string 
            = (param) {
              variable = param
              stringFunction(variable)
            }
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
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = codeToAST(`
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
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAST(input, defaultVariables);
    expect(expected).toEqual(result);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = codeToAST(`
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
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
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
    const result = checkAST(input, defaultVariables);
    expect(expected).toEqual(result);
  });
  test('multiple parameters with same name', () => {
    const input = codeToAST('a = (paramA, paramA) fun(paramA, paramA)');
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
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
          data: {
            identifier: 'paramA',
          },
        },
      ],
    };
    const result = checkAST(input, defaultVariables);
    expect(result).toEqual(expected);
  });
});