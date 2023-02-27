import { checkTypeTreeNode } from '.';
import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { CheckerTupleType, CheckerTypeNames } from '../types/types';
import { addErrors } from './helpers/addError';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { getNewErrors } from './helpers/getNewErrors';
import {
  addVariableScope,
  removeVariableScope,
} from './helpers/variableScopes';

export const checkFunctionDeclaration: CheckTypeTreeNode<
  TypeTreeNodeName.FunctionDeclaration
> = (context, functionDeclaration) => {
  const contextWithAddedVariableScope = addVariableScope(context);

  const parametersNodeTypes = functionDeclaration.parameters.items.map(
    item => checkTypeTreeNode(context, item).nodeType,
  );
  const parametersType: CheckerTupleType = {
    name: CheckerTypeNames.Tuple,
    items: parametersNodeTypes,
    hasValue: functionDeclaration.parameters.hasValue,
  };

  const returnNode = checkTypeTreeNode(
    contextWithAddedVariableScope,
    functionDeclaration.return,
  );
  const returnType = returnNode.nodeType;

  const returnErrors = getNewErrors(
    returnNode.errors,
    contextWithAddedVariableScope.errors,
  );
  const contextWithReturnErrors = addErrors(
    contextWithAddedVariableScope,
    returnErrors,
  );

  const contextWithRemovedVariableScope = removeVariableScope(
    contextWithReturnErrors,
  );

  return getCheckNodeReturn(contextWithRemovedVariableScope, {
    name: CheckerTypeNames.Function,
    parameters: parametersType,
    return: returnType,
    hasValue: returnType.hasValue,
  });
};
