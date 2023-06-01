import { expect, describe, test } from 'vitest';
import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeName } from '../../types/types';
import { isSubtypeOf } from './isSubtypeOf';

describe('string', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.String,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.String,
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('incompatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.String,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Number,
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
describe('number', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Number,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Number,
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('incompatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Number,
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.String,
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
describe('tuple', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Tuple,
      items: [
        {
          name: AstCheckerTypeName.String,
          hasValue: true,
        },
        {
          name: AstCheckerTypeName.Number,
          hasValue: true,
        },
      ],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Tuple,
      items: [
        {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
        {
          name: AstCheckerTypeName.Number,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('incompatible - same length', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Tuple,
      items: [
        {
          name: AstCheckerTypeName.String,
          hasValue: true,
        },
        {
          name: AstCheckerTypeName.Number,
          hasValue: true,
        },
      ],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Tuple,
      items: [
        {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
        {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
  test('incompatible - different length', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Tuple,
      items: [
        {
          name: AstCheckerTypeName.String,
          hasValue: true,
        },
        {
          name: AstCheckerTypeName.Number,
          hasValue: true,
        },
      ],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Tuple,
      items: [
        {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
      ],
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
describe('record', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Record,
      entries: {
        a: {
          name: AstCheckerTypeName.String,
          hasValue: true,
        },
        b: {
          name: AstCheckerTypeName.Number,
          hasValue: true,
        },
      },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Record,
      entries: {
        a: {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
        b: {
          name: AstCheckerTypeName.Number,
          hasValue: false,
        },
      },
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('incompatible - same length', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Record,
      entries: {
        a: {
          name: AstCheckerTypeName.String,
          hasValue: true,
        },
        b: {
          name: AstCheckerTypeName.Number,
          hasValue: true,
        },
      },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Record,
      entries: {
        a: {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
        b: {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
      },
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
  test('incompatible - different length', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Record,
      entries: {
        a: {
          name: AstCheckerTypeName.String,
          hasValue: true,
        },
        b: {
          name: AstCheckerTypeName.Number,
          hasValue: true,
        },
      },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Record,
      entries: {
        a: {
          name: AstCheckerTypeName.String,
          hasValue: false,
        },
      },
      hasValue: false,
    };

    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
describe('functions', () => {
  test('compatible', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Function,
      parameters: [{ name: AstCheckerTypeName.String, hasValue: true }],
      return: { name: AstCheckerTypeName.String, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Function,
      parameters: [{ name: AstCheckerTypeName.String, hasValue: false }],
      return: { name: AstCheckerTypeName.String, hasValue: false },
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('incompatible parameters', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Function,
      parameters: [],
      return: { name: AstCheckerTypeName.String, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Function,
      parameters: [{ name: AstCheckerTypeName.String, hasValue: false }],
      return: { name: AstCheckerTypeName.String, hasValue: false },
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
  test('incompatible return', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Function,
      parameters: [{ name: AstCheckerTypeName.String, hasValue: true }],
      return: { name: AstCheckerTypeName.Number, hasValue: true },
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Function,
      parameters: [{ name: AstCheckerTypeName.String, hasValue: false }],
      return: { name: AstCheckerTypeName.String, hasValue: false },
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
test('figure out', () => {
  const typeA: AstCheckerType = {
    name: AstCheckerTypeName.String,
    hasValue: false,
  };
  const typeB: AstCheckerType = {
    name: AstCheckerTypeName.FigureOut,
    id: 0,
    hasValue: false,
  };
  expect(isSubtypeOf(typeA, typeB, { figureOutEnabled: true })).toBe(true);
});
describe('atom', () => {
  test('same atom', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'Atom',
      arguments: [{ name: AstCheckerTypeName.String, hasValue: true }],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'Atom',
      arguments: [{ name: AstCheckerTypeName.String, hasValue: false }],
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('atom with different name', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'Atom',
      arguments: [{ name: AstCheckerTypeName.String, hasValue: true }],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'OtherAtom',
      arguments: [{ name: AstCheckerTypeName.String, hasValue: false }],
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
  test('atom with different arguments', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'Atom',
      arguments: [{ name: AstCheckerTypeName.String, hasValue: true }],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'Atom',
      arguments: [{ name: AstCheckerTypeName.Number, hasValue: false }],
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
describe('atom union', () => {
  test('correct', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'AtomTwo',
      arguments: [{ name: AstCheckerTypeName.String, hasValue: true }],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.AtomUnion,
      atoms: [
        {
          name: AstCheckerTypeName.Atom,
          atomName: 'AtomOne',
          arguments: [],
          hasValue: false,
        },
        {
          name: AstCheckerTypeName.Atom,
          atomName: 'AtomTwo',
          arguments: [{ name: AstCheckerTypeName.String, hasValue: false }],
          hasValue: false,
        },
        {
          name: AstCheckerTypeName.Atom,
          atomName: 'AtomTwoFree',
          arguments: [{ name: AstCheckerTypeName.Number, hasValue: false }],
          hasValue: false,
        },
      ],
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(true);
  });
  test('incorrect', () => {
    const typeA: AstCheckerType = {
      name: AstCheckerTypeName.Atom,
      atomName: 'AtomTwo',
      arguments: [{ name: AstCheckerTypeName.Number, hasValue: true }],
      hasValue: true,
    };
    const typeB: AstCheckerType = {
      name: AstCheckerTypeName.AtomUnion,
      atoms: [
        {
          name: AstCheckerTypeName.Atom,
          atomName: 'AtomOne',
          arguments: [],
          hasValue: false,
        },
        {
          name: AstCheckerTypeName.Atom,
          atomName: 'AtomTwo',
          arguments: [{ name: AstCheckerTypeName.String, hasValue: false }],
          hasValue: false,
        },
        {
          name: AstCheckerTypeName.Atom,
          atomName: 'AtomTwoFree',
          arguments: [{ name: AstCheckerTypeName.Number, hasValue: false }],
          hasValue: false,
        },
      ],
      hasValue: false,
    };
    expect(isSubtypeOf(typeA, typeB)).toBe(false);
  });
});
