import { Type } from '../types';
import { areTuplesCompatible } from './areTypesCompatible';

export const tryToFigureOutType = (baseType: Type, typeToFigureOut: Type) => {
  if (typeToFigureOut.type === 'figureOut') {
    const figuredOutType = typeToFigureOut as Type;
    figuredOutType.type = baseType.type;

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
