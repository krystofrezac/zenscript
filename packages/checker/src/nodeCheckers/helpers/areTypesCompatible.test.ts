import { expect, describe, test } from 'vitest';
import { AstCheckerType, AstCheckerTypeNames } from '../../types/types';
import { areTypesCompatible } from './areTypesCompatible';

describe('string', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.String,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.String,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.String,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Number,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('number', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Number,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Number,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Number,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.String,
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('tuple', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
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
    };
    const typeB: AstCheckerType = {
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
      ],
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible - same length', () => {
    const typeA: AstCheckerType = {
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
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Tuple,
      items: [
        {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
        {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
  test('incompatible - different length', () => {
    const typeA: AstCheckerType = {
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
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Tuple,
      items: [
        {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('record', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Record,
      entries: {
        a: {
          name: AstCheckerTypeNames.String,
          hasValue: true,
        },
        b: {
          name: AstCheckerTypeNames.Number,
          hasValue: true,
        },
      },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Record,
      entries: {
        a: {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
        b: {
          name: AstCheckerTypeNames.Number,
          hasValue: false,
        },
      },
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible - same length', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Record,
      entries: {
        a: {
          name: AstCheckerTypeNames.String,
          hasValue: true,
        },
        b: {
          name: AstCheckerTypeNames.Number,
          hasValue: true,
        },
      },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Record,
      entries: {
        a: {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
        b: {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
      },
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
  test('incompatible - different length', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Record,
      entries: {
        a: {
          name: AstCheckerTypeNames.String,
          hasValue: true,
        },
        b: {
          name: AstCheckerTypeNames.Number,
          hasValue: true,
        },
      },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Record,
      entries: {
        a: {
          name: AstCheckerTypeNames.String,
          hasValue: false,
        },
      },
      hasValue: false,
    };

    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
describe('functions', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Function,
      parameters: [{ name: AstCheckerTypeNames.String, hasValue: true }],
      return: { name: AstCheckerTypeNames.String, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Function,
      parameters: [{ name: AstCheckerTypeNames.String, hasValue: false }],
      return: { name: AstCheckerTypeNames.String, hasValue: false },
      hasValue: false,
    };
    expect(areTypesCompatible(typeA, typeB)).toBe(true);
  });
  test('incompatible parameters', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Function,
      parameters: [],
      return: { name: AstCheckerTypeNames.String, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Function,
      parameters: [{ name: AstCheckerTypeNames.String, hasValue: false }],
      return: { name: AstCheckerTypeNames.String, hasValue: false },
      hasValue: false,
    };
    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
  test('incompatible return', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeNames.Function,
      parameters: [{ name: AstCheckerTypeNames.String, hasValue: true }],
      return: { name: AstCheckerTypeNames.Number, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeNames.Function,
      parameters: [{ name: AstCheckerTypeNames.String, hasValue: false }],
      return: { name: AstCheckerTypeNames.String, hasValue: false },
      hasValue: false,
    };
    expect(areTypesCompatible(typeA, typeB)).toBe(false);
  });
});
test('figure out', () => {
  const typeA: AstCheckerType = {
    name: AstCheckerTypeNames.String,
    hasValue: false,
  };
  const typeB: AstCheckerType = {
    name: AstCheckerTypeNames.FigureOut,
    id: 0,
    hasValue: false,
  };
  expect(areTypesCompatible(typeA, typeB, { figureOutEnabled: true })).toBe(
    true,
  );
});
