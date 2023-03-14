import { expect, describe, test } from 'vitest';
import { CheckerType, CheckerTypeNames } from '../../types/types';
import { areTypesCompatible } from './areTypesCompatible';

describe('string', () => {
  test('compatible', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.String,
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.String,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('compatible', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.String,
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('number', () => {
  test('compatible', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.String,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('tuple', () => {
  test('compatible', () => {
    const typeA: CheckerType = {
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
    };
    const typeB: CheckerType = {
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
      ],
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible - same length', () => {
    const typeA: CheckerType = {
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
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Tuple,
      items: [
        {
          name: CheckerTypeNames.String,
          hasValue: false,
        },
        {
          name: CheckerTypeNames.String,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
  test('incompatible - different length', () => {
    const typeA: CheckerType = {
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
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Tuple,
      items: [
        {
          name: CheckerTypeNames.String,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe.only('functions', () => {
  test('compatible', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: true }],
        hasValue: true,
      },
      return: { name: CheckerTypeNames.String, hasValue: true },
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: false }],
        hasValue: false,
      },
      return: { name: CheckerTypeNames.String, hasValue: false },
      hasValue: false,
    };
    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test.only('incompatible parameters', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [],
        hasValue: true,
      },
      return: { name: CheckerTypeNames.String, hasValue: true },
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: false }],
        hasValue: false,
      },
      return: { name: CheckerTypeNames.String, hasValue: false },
      hasValue: false,
    };
    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
  test('incompatible return', () => {
    const typeA: CheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: true }],
        hasValue: true,
      },
      return: { name: CheckerTypeNames.Number, hasValue: true },
      hasValue: true,
    };
    const typeB: CheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: false }],
        hasValue: false,
      },
      return: { name: CheckerTypeNames.String, hasValue: false },
      hasValue: false,
    };
    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
test('figure out', () => {
  const typeA: CheckerType = {
    name: CheckerTypeNames.FigureOut,
    id: 0,
    hasValue: false,
  };
  const typeB: CheckerType = {
    name: CheckerTypeNames.FigureOut,
    id: 0,
    hasValue: false,
  };
  expect(areTypesCompatible(typeA, typeB)).toBe(true);
});
