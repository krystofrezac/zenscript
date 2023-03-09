import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { CheckerType, CheckerTypeNames } from '../types/types';
import { addVariableToContext } from './helpers/addVariableToContext';
import { checkIfVariableWithNameIsAlreadyDeclared } from './helpers/checkIfVariableWithNameIsAreadyDeclared';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';

export const checkParameter: CheckTypeTreeNode<TypeTreeNodeName.Parameter> = (
  context,
  parameter,
) => {
  const alreadyDeclaredError = checkIfVariableWithNameIsAlreadyDeclared(
    context,
    parameter.parameterName,
  );

  if (alreadyDeclaredError) {
    return alreadyDeclaredError;
  }

  const variableType: CheckerType = {
    name: CheckerTypeNames.FigureOut,
    hasValue: true,
  };
  const contextWithVariable = addVariableToContext(context, {
    variableName: parameter.parameterName,
    variableType,
  });
  return getCheckNodeReturn(contextWithVariable, variableType);
};
