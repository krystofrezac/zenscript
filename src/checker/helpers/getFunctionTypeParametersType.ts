import { NonterminalNode } from 'ohm-js';
import { getNewGenericsId } from '../checkerContext';
import { Type, GenericType, CheckerContext } from '../types';
import { createType } from './createType';

export const getFunctionTypeParametersType = (
  context: CheckerContext,
  parameters: NonterminalNode,
) => {
  const parametersTypes = parameters
    .asIteration()
    .children.map(parameter => parameter.getType());

  const parametersJoinedGenericsTypes = parametersTypes.reduce<Type[]>(
    (acc, current) => {
      if (current.type === 'namedGeneric') {
        const sameGeneric = acc.find(
          accItem =>
            accItem.type === 'namedGeneric' && accItem.name === current.name,
        ) as GenericType | undefined;
        const id = sameGeneric?.id ?? getNewGenericsId(context);

        acc.push({ ...current, id });
      } else acc.push(current);
      return acc;
    },
    [],
  );

  return createType({ type: 'tuple', items: parametersJoinedGenericsTypes });
};
