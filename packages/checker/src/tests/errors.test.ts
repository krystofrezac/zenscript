import { describe, expect, test } from 'vitest';
import type { CheckAstReturn } from '..';
import { checkAst } from '..';
import type { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { getAst } from '@zen-script/ast';

describe('chained errors', () => {
  test('UnknownIdentifier', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('ExpressionWithoutValueUsedAsValue', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('VariableTypeMismatch', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('FunctionParametersMismatch', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('EmptyBlock', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('CallingNonCallableExpression', () => {
    const input = getAst(`
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
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
