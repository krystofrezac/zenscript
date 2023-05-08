import { describe, expect, test } from 'vitest';
import { CheckAstReturn, checkAst } from '..';
import { codeToAst } from '../../tests/helpers';
import { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';

describe('chained errors', () => {
  test(AstCheckerErrorName.UnknownIdentifier, () => {
    const input = codeToAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.ExpressionWithoutValueUsedAsValue, () => {
    const input = codeToAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.VariableTypeMismatch, () => {
    const input = codeToAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.FunctionParametersMismatch, () => {
    const input = codeToAst(`
      a = stringFunction() 
      b = a
      c = b
    `);
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
    const expected: CheckAstReturn = {
      errors: [
        {
          name: AstCheckerErrorName.FunctionParametersMismatch,
          data: {
            expected: [
              {
                name: AstCheckerTypeNames.String,
                hasValue: true,
              },
            ],
            received: [],
          },
        },
      ],
    };
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.EmptyBlock, () => {
    const input = codeToAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test(AstCheckerErrorName.CallingNonCallableExpression, () => {
    const input = codeToAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
