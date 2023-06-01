import { describe, expect, test } from 'vitest';
import type { CheckAstResult } from '..';
import type { VariableScope } from '../types';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeName } from '../types/types';
import { testCheckAst } from './helpers';

describe('chained errors', () => {
  test('UnknownIdentifier', () => {
    const input = `
      b = a
      c = b
      d = c
    `;
    const expected: CheckAstResult = {
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
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('ExpressionWithoutValueUsedAsValue', () => {
    const input = `
      a: string
      b = a
      c = b
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.ExpressionWithoutValueUsedAsValue,
          data: {
            expressionType: {
              name: AstCheckerTypeName.String,
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
  test('VariableTypeMismatch', () => {
    const input = `
      a: string = 1
      b: string = a
      c: number = a
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'a',
            expected: { name: AstCheckerTypeName.String, hasValue: false },
            received: { name: AstCheckerTypeName.Number, hasValue: true },
          },
        },
        {
          name: AstCheckerErrorName.VariableTypeMismatch,
          data: {
            variableName: 'c',
            expected: { name: AstCheckerTypeName.Number, hasValue: false },
            received: { name: AstCheckerTypeName.String, hasValue: true },
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('FunctionParametersMismatch', () => {
    const input = `
      a = stringFunction() 
      b = a
      c = b
    `;
    const defaultVariables: VariableScope = [
      {
        variableName: 'stringFunction',
        variableType: {
          name: AstCheckerTypeName.Function,
          parameters: [
            {
              name: AstCheckerTypeName.String,
              hasValue: true,
            },
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
          name: AstCheckerErrorName.FunctionParametersMismatch,
          data: {
            expected: [
              {
                name: AstCheckerTypeName.String,
                hasValue: true,
              },
            ],
            received: [],
          },
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input, defaultVariables });
    expect(result).toEqual(expected);
  });
  test('EmptyBlock', () => {
    const input = `
      a = {}  
      b = a
      c = b
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.EmptyBlock,
          data: {},
        },
      ],
      exportedVariables: [],
    };
    const result = testCheckAst({ entryFile: input });
    expect(result).toEqual(expected);
  });
  test('CallingNonCallableExpression', () => {
    const input = `
      a = 1
      b = a()
      c = b
      d = c
    `;
    const expected: CheckAstResult = {
      errors: [
        {
          name: AstCheckerErrorName.CallingNonCallableExpression,
          data: {
            callee: {
              name: AstCheckerTypeName.Number,
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
});
