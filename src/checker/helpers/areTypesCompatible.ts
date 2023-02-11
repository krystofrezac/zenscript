import { Type } from '../types';
import { isTypeGeneric } from './isTypeGeneric';
import { typeToString } from './typeToString';

type Comparator = (base: Type, compare: Type) => boolean;
type ComparatorContext = {
  genericTypes: { genericTypeIndex: number; realType: Type }[];
  genericTypesIdOffset: number | null;
};

const findGenericTypeByIndex = (context: ComparatorContext, index: number) =>
  context.genericTypes.find(item => item.genericTypeIndex === index);
const registerRealTypeForGeneric = (
  context: ComparatorContext,
  {
    genericTypeIndex,
    realType,
  }: {
    genericTypeIndex: number;
    realType: Type;
  },
) => {
  context.genericTypes.push({ genericTypeIndex, realType });
};

const areTypesCompatibleWithContext =
  (context: ComparatorContext): Comparator =>
  (base, compare) => {
    if (compare.type === 'unknown') return true;
    if (base.type === 'string' && compare.type === 'string') return true;
    if (base.type === 'number' && compare.type === 'number') return true;
    if (base.type === 'boolean' && compare.type === 'boolean') return true;
    if (isTypeGeneric(base) && isTypeGeneric(compare)) {
      if (context.genericTypesIdOffset === null) {
        context.genericTypesIdOffset = compare.id - base.id;
        return true;
      }
      return base.id + context.genericTypesIdOffset === compare.id;
    }
    // if we have a generic and some type, update the generic to match the type
    if (isTypeGeneric(base)) {
      console.log(typeToString(base), typeToString(compare));
      const genericIndex = base.id ?? -1;
      const alreadyRegisteredType = findGenericTypeByIndex(
        context,
        genericIndex,
      )?.realType;
      if (alreadyRegisteredType)
        return areTypesCompatibleWithContext(context)(
          alreadyRegisteredType,
          compare,
        );

      registerRealTypeForGeneric(context, {
        genericTypeIndex: genericIndex,
        realType: compare,
      });
      return true;
    }
    if (base.type === 'tuple' && compare.type === 'tuple') {
      return areTuplesCompatible(
        base,
        compare,
        areTypesCompatibleWithContext(context),
      );
    }
    if (base.type === 'function' && compare.type === 'function') {
      return (
        areTuplesCompatible(
          base.parameters,
          compare.parameters,
          areTypesCompatibleWithContext(context),
        ) &&
        areTypesCompatibleWithContext(context)(base.returns, compare.returns)
      );
    }

    return false;
  };
export const areTypesCompatible = areTypesCompatibleWithContext({
  genericTypes: [],
  genericTypesIdOffset: null,
});

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
