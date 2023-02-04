import { Type } from '../types';

type Comparator = (base: Type, compare: Type) => boolean;

export const areTypesCompatible: Comparator = (base, compare) => {
  if (compare.type === 'unknown') return true;
  if (base.type === 'string' && compare.type === 'string') return true;
  if (base.type === 'number' && compare.type === 'number') return true;
  if (base.type === 'tuple' && compare.type === 'tuple') {
    return areTuplesCompatible(base, compare, areTypesCompatible);
  }
  if (base.type === 'function' && compare.type === 'function') {
    return (
      areTuplesCompatible(
        base.parameters,
        compare.parameters,
        areTypesCompatible,
      ) && areTypesCompatible(base.returns, compare.returns)
    );
  }

  return false;
};

export const areTuplesCompatible = (
  baseTuple: Type,
  compareTuple: Type,
  nextLevelComparator: Comparator,
): boolean => {
  if (baseTuple.type !== 'tuple' || compareTuple.type !== 'tuple') return false;

  if (baseTuple.items.length !== compareTuple.items.length) return false;

  return baseTuple.items.every((baseItem, index) => {
    const compareItem = compareTuple.items[index];
    if (!compareItem) return false;
    return nextLevelComparator(baseItem, compareItem);
  });
};
