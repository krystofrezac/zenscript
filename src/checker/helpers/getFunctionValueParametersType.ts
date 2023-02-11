import { NonterminalNode } from 'ohm-js';
import {
  findVariableInCurrentScope,
  addError,
  addVariableToCurrentScope,
  getNewGenericsId,
} from '../checkerContext';
import { CheckerContext } from '../types';
import { createType } from './createType';

export const getFunctionValueParametersType = (
  context: CheckerContext,
  parameters: NonterminalNode,
) => {
  const parametersTypes = parameters.asIteration().children.map(parameter => {
    const parameterName = parameter.getName();
    const defaultType = createType({
      type: 'figureOut',
      defaultType: createType({
        type: 'generic',
        id: getNewGenericsId(context),
        name: parameterName,
      }),
    });

    if (findVariableInCurrentScope(context, parameterName)) {
      addError(context, {
        message: `variable with name '${parameterName}' is already declared in this scope`,
      });
      return defaultType;
    }

    addVariableToCurrentScope(context, {
      name: parameterName,
      type: defaultType,
      hasValue: true,
    });
    return defaultType;
  });
  return createType({ type: 'tuple', items: parametersTypes });
};
