import { expect, describe, test } from 'vitest';
import { AstCheckerType, CheckerTypeNames } from '../../types/types';
import { areTypesCompatible } from './areTypesCompatible';

describe('string', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.String,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: CheckerTypeNames.String,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.String,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('number', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible', () => {
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.Number,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: CheckerTypeNames.String,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('tuple', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
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
    const typeB: AstCheckerType = {
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
    const typeA: AstCheckerType = {
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
    const typeB: AstCheckerType = {
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
    const typeA: AstCheckerType = {
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
    const typeB: AstCheckerType = {
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
describe('functions', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: true }],
        hasValue: true,
      },
      return: { name: CheckerTypeNames.String, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
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
  test('incompatible parameters', () => {
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [],
        hasValue: true,
      },
      return: { name: CheckerTypeNames.String, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
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
    const typeA: AstCheckerType = {
      name: CheckerTypeNames.Function,
      parameters: {
        name: CheckerTypeNames.Tuple,
        items: [{ name: CheckerTypeNames.String, hasValue: true }],
        hasValue: true,
      },
      return: { name: CheckerTypeNames.Number, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
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
  const typeA: AstCheckerType = {
    name: CheckerTypeNames.String,
    hasValue: false,
  };
  const typeB: AstCheckerType = {
    name: CheckerTypeNames.FigureOut,
    id: 0,
    hasValue: false,
  };
  expect(areTypesCompatible(typeA, typeB, { figureOutEnabled: true })).toBe(
    true,
  );
});
