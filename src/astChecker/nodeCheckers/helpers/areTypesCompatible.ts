import { pipe } from '../../../helpers/pipe';
import { MaybeArray } from '../../../typeUtils';
import { AstCheckerType, AstCheckerTypeNames } from '../../types/types';

type AreTypesCompatibleOptions = { figureOutEnabled?: boolean };

export const areTypesCompatible = (
  typeA: MaybeArray<AstCheckerType>,
  typeB: MaybeArray<AstCheckerType>,
  options: AreTypesCompatibleOptions = { figureOutEnabled: false },
): boolean => {
  const { figureOutEnabled } = options;

  if (Array.isArray(typeA) || Array.isArray(typeB)) {
    if (!Array.isArray(typeA) || !Array.isArray(typeB)) return false;
    return checkArray(typeA, typeB, options);
  }

  if (
    figureOutEnabled &&
    (typeA.name === AstCheckerTypeNames.FigureOut ||
      typeB.name === AstCheckerTypeNames.FigureOut)
  )
    return true;

  if (
    shallowCompareTypes.includes(typeA.name) &&
    shallowCompareTypes.includes(typeB.name)
  ) {
    return typeA.name === typeB.name;
  }

  if (
    typeA.name === AstCheckerTypeNames.Tuple &&
    typeB.name === AstCheckerTypeNames.Tuple
  ) {
    return checkArray(typeA.items, typeB.items, options);
  }

  if (
    typeA.name === AstCheckerTypeNames.Record &&
    typeB.name === AstCheckerTypeNames.Record
  ) {
    const entriesA = pipe(Object.entries, sortEntries)(typeA.entries);
    const entriesB = pipe(Object.entries, sortEntries)(typeB.entries);

    const haveSameLength = entriesA.length === entriesB.length;
    return (
      haveSameLength &&
      entriesA.every((entryA, index) => {
        const entryB = entriesB[index];
        return entryB && areTypesCompatible(entryA[1], entryB[1], options);
      })
    );
  }

  if (
    typeA.name === AstCheckerTypeNames.Function &&
    typeB.name === AstCheckerTypeNames.Function
  ) {
    return (
      areTypesCompatible(typeA.parameters, typeB.parameters, options) &&
      areTypesCompatible(typeA.return, typeB.return, options)
    );
  }
  return false;
};

const shallowCompareTypes: AstCheckerTypeNames[] = [
  AstCheckerTypeNames.String,
  AstCheckerTypeNames.Number,
];

const sortEntries = (entries: [string, AstCheckerType][]) =>
  [...entries].sort(([a], [b]) => a.localeCompare(b));

const checkArray = (
  typeA: AstCheckerType[],
  typeB: AstCheckerType[],
  options: AreTypesCompatibleOptions,
) => {
  const haveSameLength = typeA.length === typeB.length;
  return (
    haveSameLength &&
    typeA.every((itemA, index) => {
      const itemB = typeB[index];
      return itemB && areTypesCompatible(itemA, itemB, options);
    })
  );
};
