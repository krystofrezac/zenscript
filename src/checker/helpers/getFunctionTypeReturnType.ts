import { NonterminalNode } from 'ohm-js';
import { addError } from '../checkerContext';
import { CheckerContext, GenericType, TupleType } from '../types';
import { createType } from './createType';

type GetFunctionTypeReturnTypeParams = {
  returnExpression: NonterminalNode;
  parametersType: TupleType;
};

export const getFunctionTypeReturnType = (
  context: CheckerContext,
  { parametersType, returnExpression }: GetFunctionTypeReturnTypeParams,
) => {
  const returnMaybeWithoutIndexType = returnExpression.getType();

  // if the return type dependents on generic parameter
  if (
    returnMaybeWithoutIndexType.type === 'namedGeneric' &&
    returnMaybeWithoutIndexType.id === -1
  ) {
    // parameter that return type is depending on
    const matchingParameter = parametersType.items.find(
      parameter =>
        parameter.type === 'namedGeneric' &&
        parameter.name === returnMaybeWithoutIndexType.name,
    ) as GenericType | undefined;
    if (!matchingParameter) {
      addError(context, {
        message:
          "Could not figure out return type of function. It's probably because it depends on generic that does not exist!",
      });
      return createType({ type: 'unknown' });
    }
    return {
      ...returnMaybeWithoutIndexType,
      id: matchingParameter.id,
    };
  }
  return returnMaybeWithoutIndexType;
};
