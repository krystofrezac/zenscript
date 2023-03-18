import { AstCheckerType, AstCheckerTypeNames } from '../../types/types';

type AreTypesCompatible = { figureOutEnabled?: boolean };

export const areTypesCompatible = (
  typeA: AstCheckerType,
  typeB: AstCheckerType,
  options: AreTypesCompatible = { figureOutEnabled: false },
): boolean => {
  const { figureOutEnabled } = options;

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
    const haveSameLength = typeA.items.length === typeB.items.length;
    return (
      haveSameLength &&
      typeA.items.every((itemA, index) => {
        const itemB = typeB.items[index];
        return itemB && areTypesCompatible(itemA, itemB, options);
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
