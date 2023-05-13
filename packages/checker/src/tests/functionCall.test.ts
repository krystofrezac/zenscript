import { describe, expect, test } from 'vitest';
import type { CheckAstReturn } from '..';
import { checkAst } from '..';
import { AstCheckerErrorName } from '../types/errors';
import { AstCheckerTypeNames } from '../types/types';
import { getAst } from '@zen-script/ast';
import type { VariableScope } from '../types';

describe('without parameters', () => {
  test('value assignment', () => {
    const input = getAst(`
          a = ()1
          b = a() 
        `);
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('value assignment with correct explicit type', () => {
    const input = getAst(`
          a = ()1
          b: number = a() 
        `);
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('value assignment with incorrect explicit type', () => {
    const input = getAst(`
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('calling higher order function', () => {
    const input = getAst(`
          a = ()()()1
          b: number = a()()()
        `);
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('partially calling higher order function', () => {
    const input = getAst(`
          a = ()()()1
          b: ()number = a()()
        `);
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
  test('calling non callable expression', () => {
    const input = getAst(`
          a = 1
          b = a()
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
  test('calling expression without value', () => {
    const input = getAst(`
          a: number
          b = a()
        `);
    const expected: CheckAstReturn = {
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
    const result = checkAst(input);
    expect(result).toEqual(expected);
  });
});
describe('with simple parameters', () => {
  test('single parameter', () => {
    const input = getAst('a: string = stringFunction("")');
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
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('multiple parameters', () => {
    const input = getAst('a: string = stringNumberNumberFunction("", 1, 2)');
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
    const expected: CheckAstReturn = {
      errors: [],
      exportedVariables: [],
    };
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
  test('explicit implicit mismatch - missing parameter', () => {
    const input = getAst('a: string = stringFunction()');
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
    const expected: CheckAstReturn = {
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
    const result = checkAst(input, defaultVariables);
    expect(result).toEqual(expected);
  });
});
