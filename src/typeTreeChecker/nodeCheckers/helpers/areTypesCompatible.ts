import { CheckerType, CheckerTypeNames } from '../../types/types';

export const areTypesCompatible = (
  typeA: CheckerType,
  typeB: CheckerType,
): boolean => {
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
        return itemB && areTypesCompatible(itemA, itemB);
      })
    );
  }

  if (
    typeA.name === CheckerTypeNames.Function &&
    typeB.name === CheckerTypeNames.Function
  ) {
    return (
      areTypesCompatible(typeA.parameters, typeB.parameters) &&
      areTypesCompatible(typeA.return, typeB.return)
    );
  }
  return false;
};

const shallowCompareTypes: CheckerTypeNames[] = [
  CheckerTypeNames.String,
  CheckerTypeNames.Number,
];
