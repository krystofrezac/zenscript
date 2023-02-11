import { Type } from '../types';

export const typeToString = (type: Type): string => {
  if (type.type === 'string') return 'string';
  if (type.type === 'number') return 'number';
  if (type.type === 'boolean') return 'boolean';
  if (type.type === 'unknown') return 'unknown';
  if (type.type === 'namedGeneric') return `'${type.name}`;
  if (type.type === 'generic') return `'${type.id}`;
  if (type.type === 'tuple')
    return type.items.map(i => typeToString(i)).join(', ');
  if (type.type === 'function')
    return `(${typeToString(type.parameters)}) ${typeToString(type.returns)}`;
  return '!invalid!';
};
