import { CheckerType, CheckerTypeNames } from '../../types/types';

type AreTypesCompatible = { figureOutEnabled?: boolean };

export const areTypesCompatible = (
  typeA: CheckerType,
  typeB: CheckerType,
  options: AreTypesCompatible = { figureOutEnabled: false },
): boolean => {
  const { figureOutEnabled } = options;

  if (
    figureOutEnabled &&
    (typeA.name === CheckerTypeNames.FigureOut ||
      typeB.name === CheckerTypeNames.FigureOut)
  )
    return true;

  if (
    shallowCompareTypes.includes(typeA.name) &&
    shallowCompareTypes.includes(typeB.name)
  ) {
    return typeA.name === typeB.name;
  }

  if (
    typeA.name === CheckerTypeNames.Tuple &&
    typeB.name === CheckerTypeNames.Tuple
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
    typeA.name === CheckerTypeNames.Function &&
    typeB.name === CheckerTypeNames.Function
  ) {
    return (
      areTypesCompatible(typeA.parameters, typeB.parameters, options) &&
      areTypesCompatible(typeA.return, typeB.return, options)
    );
  }
  return false;
};

const shallowCompareTypes: CheckerTypeNames[] = [
  CheckerTypeNames.String,
  CheckerTypeNames.Number,
];
