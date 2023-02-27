import { CheckerType } from '../../types/types';

export const areTypesCompatible = (typeA: CheckerType, typeB: CheckerType) =>
  typeA.name === typeB.name;
