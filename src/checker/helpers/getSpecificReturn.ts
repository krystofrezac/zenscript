import { FunctionType, Type } from '../types';

export const getSpecificReturn = (
  functionType: FunctionType,
  calledWithTuple: Type,
) => {
  const returnType = functionType.returns;
  if (returnType.type !== 'generic' || calledWithTuple.type !== 'tuple')
    return functionType.returns;

  const calledWithArguments = calledWithTuple.items;

  const specificType = getFirst(
    functionType.parameters.items,
    (parameter, index) => {
      if (parameter.type === 'generic' && parameter.index === returnType.index)
        return calledWithArguments[index];

      if (
        parameter.type === 'function' &&
        parameter.returns.type === 'generic'
      ) {
        const innerParameter = calledWithArguments[index];
        if (innerParameter && innerParameter.type === 'function')
          return innerParameter.returns;
      }
    },
  );
  return specificType ?? functionType.returns;
};

const getFirst = <T, R>(
  arr: T[],
  getData: (item: T, index: number) => R | undefined,
) => {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!item) return;

    const itemResult = getData(item, i);
    if (itemResult) return itemResult;
  }
  return undefined;
};
