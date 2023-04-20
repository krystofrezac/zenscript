import { describe, expect, test } from 'vitest';
import { CheckAstReturn, checkAst } from '..';
import { codeToAst } from '../../tests/helpers';
import { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = codeToAst('a = () 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(expected).toEqual(result);
  });
  test('type assignment', () => {
    const input = codeToAst('a : () number');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(expected).toEqual(result);
  });
  test('assigning value and same explicit type', () => {
    const input = codeToAst('a : () number = () 1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(expected).toEqual(result);
  });
  test('assigning value and explicit type with different return', () => {
    const input = codeToAst('a : () string = () 1');
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            expected: {
              name: AstCheckerTypeNames.Function,
              parameters: {
                name: AstCheckerTypeNames.Tuple,
                items: [],
                hasValue: false,
              },
              return: {
                name: AstCheckerTypeNames.String,
                hasValue: false,
              },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Function,
              parameters: {
                name: AstCheckerTypeNames.Tuple,
                items: [],
                hasValue: true,
              },
              return: {
                name: AstCheckerTypeNames.Number,
                hasValue: true,
              },
              hasValue: true,
            },
            variableName: 'a',
          },
        },
      ],
    };
    const result = checkAst(input);
    expect(expected).toEqual(result);
  });
  test('propagating errors from function body', () => {
    const input = codeToAst('a = () b');
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('higher order function', () => {
    const input = codeToAst('a: ()()()number = ()()()1');
    const expected: CheckAstReturn = {
      errors: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});

describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = codeToAst(`
          a: (string) string = (param) stringFunction(param)
        `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: {
            name: AstCheckerTypeNames.Tuple,
            items: [{ name: AstCheckerTypeNames.String, hasValue: true }],
            hasValue: true,
          },
          return: {
            name: AstCheckerTypeNames.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('single parameter - indirect usage', () => {
    const input = codeToAst(`
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
          name: AstCheckerTypeNames.Function,
          parameters: {
            name: AstCheckerTypeNames.Tuple,
            items: [{ name: AstCheckerTypeNames.String, hasValue: true }],
            hasValue: true,
          },
          return: {
            name: AstCheckerTypeNames.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = codeToAst(`
          a: (string, number, number) string 
           = (paramA, paramB, paramC) stringNumberNumberFunction(paramA, paramB, paramC)
        `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: {
            name: AstCheckerTypeNames.Tuple,
            items: [
              { name: AstCheckerTypeNames.String, hasValue: true },
              { name: AstCheckerTypeNames.Number, hasValue: true },
              { name: AstCheckerTypeNames.Number, hasValue: true },
            ],
            hasValue: true,
          },
          return: {
            name: AstCheckerTypeNames.String,
            hasValue: true,
          },
          hasValue: true,
        },
      },
    ];
    const expected: CheckAstReturn = { errors: [] };
    const result = checkAst(input, defaultVariables);
    expect(expected).toEqual(result);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = codeToAst(`
          a: (string, number, number) string 
           = (paramA, paramB) stringNumberNumberFunction(paramA, paramB)
        `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringNumberNumberFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: {
            name: AstCheckerTypeNames.Tuple,
            items: [
              { name: AstCheckerTypeNames.String, hasValue: true },
              { name: AstCheckerTypeNames.Number, hasValue: true },
            ],
            hasValue: true,
          },
          return: {
            name: AstCheckerTypeNames.String,
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
              name: AstCheckerTypeNames.Function,
              parameters: {
                name: AstCheckerTypeNames.Tuple,
                items: [
                  {
                    name: AstCheckerTypeNames.String,
                    hasValue: false,
                  },
                  {
                    name: AstCheckerTypeNames.Number,
                    hasValue: false,
                  },
                  {
                    name: AstCheckerTypeNames.Number,
                    hasValue: false,
                  },
                ],
                hasValue: false,
              },
              return: { name: AstCheckerTypeNames.String, hasValue: false },
              hasValue: false,
            },
            received: {
              name: AstCheckerTypeNames.Function,
              parameters: {
                name: AstCheckerTypeNames.Tuple,
                items: [
                  {
                    name: AstCheckerTypeNames.String,
                    hasValue: true,
                  },
                  {
                    name: AstCheckerTypeNames.Number,
                    hasValue: true,
                  },
                ],
                hasValue: true,
              },
              return: { name: AstCheckerTypeNames.String, hasValue: true },
              hasValue: true,
            },
          },
        },
      ],
    };
    const result = checkAst(input, defaultVariables);
    expect(expected).toEqual(result);
  });
  test('multiple parameters with same name', () => {
    const input = codeToAst('a = (paramA, paramA) fun(paramA, paramA)');
    const defaultVariables: VariableScope = [
      {
        variableName: 'fun',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: {
            name: AstCheckerTypeNames.Tuple,
            items: [
              {
                name: AstCheckerTypeNames.String,
                hasValue: true,
              },
              {
                name: AstCheckerTypeNames.String,
                hasValue: true,
              },
            ],
            hasValue: true,
          },
          return: { name: AstCheckerTypeNames.String, hasValue: true },
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
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
});
