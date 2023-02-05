import { Type } from '../types';
import { areTuplesCompatible } from './areTypesCompatible';

export const tryToFigureOutType = (baseType: Type, typeToFigureOut: Type) => {
  if (typeToFigureOut.type === 'figureOut') {
    (typeToFigureOut as Type).type = baseType.type;
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

// export transformFigureOutToUnknown =
