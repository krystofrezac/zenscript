import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeName } from '../../types/types';
import { pipe } from '@zen-script/helpers';
import type { MaybeArray } from '@zen-script/helpers';

type isSubtypeOfOptions = { figureOutEnabled?: boolean };

export const isSubtypeOf = (
  subtype: MaybeArray<AstCheckerType>,
  base: MaybeArray<AstCheckerType>,
  options: isSubtypeOfOptions = { figureOutEnabled: false },
): boolean => {
  const { figureOutEnabled } = options;

  if (Array.isArray(subtype) || Array.isArray(base)) {
    if (!Array.isArray(subtype) || !Array.isArray(base)) return false;
    return checkArray(subtype, base, options);
  }

  if (
    figureOutEnabled &&
    (subtype.name === AstCheckerTypeName.FigureOut ||
      base.name === AstCheckerTypeName.FigureOut)
  )
    return true;

  if (
    shallowCompareTypes.includes(subtype.name) &&
    shallowCompareTypes.includes(base.name)
  ) {
    return subtype.name === base.name;
  }

  if (
    subtype.name === AstCheckerTypeName.Tuple &&
    base.name === AstCheckerTypeName.Tuple
  ) {
    return checkArray(subtype.items, base.items, options);
  }

  if (
    subtype.name === AstCheckerTypeName.Record &&
    base.name === AstCheckerTypeName.Record
  ) {
    const entriesA = pipe(subtype.entries)
      .to(Object.entries)
      .to(sortEntries)
      .result();
    const entriesB = pipe(base.entries)
      .to(Object.entries)
      .to(sortEntries)
      .result();

    const haveSameLength = entriesA.length === entriesB.length;
    return (
      haveSameLength &&
      entriesA.every((entryA, index) => {
        const entryB = entriesB[index];
        return entryB && isSubtypeOf(entryA[1], entryB[1], options);
      })
    );
  }

  if (
    subtype.name === AstCheckerTypeName.Function &&
    base.name === AstCheckerTypeName.Function
  ) {
    return (
      isSubtypeOf(subtype.parameters, base.parameters, options) &&
      isSubtypeOf(subtype.return, base.return, options)
    );
  }

  if (
    subtype.name === AstCheckerTypeName.Atom &&
    base.name === AstCheckerTypeName.Atom
  ) {
    const sameAtomName = subtype.atomName === base.atomName;
    return sameAtomName && isSubtypeOf(subtype.arguments, base.arguments);
  }

  if (
    subtype.name === AstCheckerTypeName.Atom &&
    base.name === AstCheckerTypeName.AtomUnion
  ) {
    return base.atoms.some(baseAtom => isSubtypeOf(baseAtom, subtype));
  }

  if (
    subtype.name === AstCheckerTypeName.AtomUnion &&
    base.name === AstCheckerTypeName.AtomUnion
  ) {
    return subtype.atoms.every(subAtom =>
      base.atoms.some(baseAtom => isSubtypeOf(baseAtom, subAtom)),
    );
  }

  return false;
};

const shallowCompareTypes: AstCheckerTypeName[] = [
  AstCheckerTypeName.String,
  AstCheckerTypeName.Number,
];

const sortEntries = (entries: [string, AstCheckerType][]) =>
  [...entries].sort(([a], [b]) => a.localeCompare(b));

const checkArray = (
  typeA: AstCheckerType[],
  typeB: AstCheckerType[],
  options: isSubtypeOfOptions,
) => {
  const haveSameLength = typeA.length === typeB.length;
  return (
    haveSameLength &&
    typeA.every((itemA, index) => {
      const itemB = typeB[index];
      return itemB && isSubtypeOf(itemA, itemB, options);
    })
  );
};
