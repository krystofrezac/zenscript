import { GenericType, NamedGenericType, Type } from '../types';

export const isTypeGeneric = (
  type: Type,
): type is GenericType | NamedGenericType =>
  ['generic', 'namedGeneric'].includes(type.type);
