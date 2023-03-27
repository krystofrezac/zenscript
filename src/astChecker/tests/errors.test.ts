import { describe, expect, test } from 'vitest';
import { CheckAstReturn, checkAST } from '..';
import { codeToAST } from '../../tests/helpers';
import { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

describe('chained errors', () => {
  test(AstCheckerErrorName.UnknownIdentifier, () => {
    const input = codeToAST(`
      b = a
      c = b
      d = c
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.UnknownIdentifier,
          data: {
            identifier: 'a',
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.ExpressionWithoutValueUsedAsValue, () => {
    const input = codeToAST(`
      a: string
      b = a
      c = b
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: AstCheckerTypeNames.String,
              hasValue: false,
            },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.VariableTypeMismatch, () => {
    const input = codeToAST(`
      a: string = 1
      b: string = a
      c: number = a
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: AstCheckerTypeNames.String, hasValue: false },
            received: { name: AstCheckerTypeNames.Number, hasValue: true },
          },
        },
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'c',
            expected: { name: AstCheckerTypeNames.Number, hasValue: false },
            received: { name: AstCheckerTypeNames.String, hasValue: true },
          },
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.FunctionParametersMismatch, () => {
    const input = codeToAST(`
      a = stringFunction() 
      b = a
      c = b
    `);
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeNames.Function,
          parameters: {
            name: AstCheckerTypeNames.Tuple,
            items: [
              {
                name: AstCheckerTypeNames.String,
                hasValue: true,
              },
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
          name: AstCheckerErrorName.FunctionParametersMismatch,
          data: {
            expected: {
              name: AstCheckerTypeNames.Tuple,
              items: [
                {
                  name: AstCheckerTypeNames.String,
                  hasValue: true,
                },
              ],
              hasValue: true,
            },
            received: {
              name: AstCheckerTypeNames.Tuple,
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
  test(AstCheckerErrorName.EmptyBlock, () => {
    const input = codeToAST(`
      a = {}  
      b = a
      c = b
    `);
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.EmptyBlock,
          data: {},
        },
      ],
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.CallingNonCallableExpression, () => {
    const input = codeToAST(`
      a = 1
      b = a()
      c = b
      d = c
    `);
    const expected: CheckAstReturn = {
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
    };
    const result = checkAST(input);
    expect(result).toEqual(expected);
  });
});
