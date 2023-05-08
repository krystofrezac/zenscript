import { checkAstNode } from '..';
import { AstNodeName } from '../../../ast/types';
import { CheckAstNode } from '../../types';
import { AstCheckerTypeNames } from '../../types/types';
import { checkAstNodes } from '../helpers/checkAstNodes';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';

export const checkFunctionDeclarationType: CheckAstNode<
  AstNodeName.FunctionDeclarationType
> = (context, functionDeclaration) => {
  const { context: parametersContext, nodeTypes: parametersTypes } =
    checkAstNodes(context, functionDeclaration.parameters);

  const { nodeType: returnType, ...returnContext } = checkAstNode(
    parametersContext,
    functionDeclaration.return,
  );

  return getCheckNodeReturn(returnContext, {
    name: AstCheckerTypeNames.Function,
    parameters: parametersTypes,
    return: returnType,
    hasValue: returnType.hasValue,
  });
};
