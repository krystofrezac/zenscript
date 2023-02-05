import { Entries } from '../../typeUtils';
import { Type } from '../types';
import { areTuplesCompatible } from './areTypesCompatible';

export const tryToFigureOutType = (baseType: Type, typeToFigureOut: Type) => {
  if (typeToFigureOut.type === 'figureOut') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete typeToFigureOut.defaultType;
    const figuredOutType = typeToFigureOut as Type;

    (Object.entries(baseType) as Entries<Type>).forEach(([key, value]) => {
      figuredOutType[key] = value;
    });

    return;
  }

  if (
    baseType.type === 'tuple' &&
    typeToFigureOut.type === 'tuple' &&
    areTuplesCompatible(baseType, typeToFigureOut, () => true)
  ) {
    baseType.items.forEach((baseItem, index) => {
      const itemToFigureOut = typeToFigureOut.items[index];
      if (!itemToFigureOut) return;

      tryToFigureOutType(baseItem, itemToFigureOut);
    });
  }
};

export const getDefaultTypeWhenFigureOut = (type: Type) => {
  if (type.type === 'figureOut') return type.defaultType;
  return type;
};
