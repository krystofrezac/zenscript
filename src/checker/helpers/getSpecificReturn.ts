import { FunctionType, TupleType, Type } from '../types';
import { createType } from './createType';

export const getSpecificReturn = (
  functionType: FunctionType,
  calledWithParameters: Type,
) => {
  const returnType = functionType.returns;
  if (returnType.type !== 'generic' || calledWithParameters.type !== 'tuple')
    return functionType.returns;

  const genericParameterIndex = functionType.parameters.items.findIndex(
    parameter =>
      parameter.type === 'generic' && parameter.index === returnType.index,
  );
  const specificType = calledWithParameters.items[genericParameterIndex];
  return specificType ?? createType({ type: 'unknown' });
};
