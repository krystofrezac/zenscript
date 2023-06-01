import type { AstNodeName } from '@zen-script/ast';
import { checkAstNode } from '..';
import type { CheckAstNode } from '../../types';
import { AstCheckerTypeName } from '../../types/types';
import { checkAstNodes } from '../helpers/checkAstNodes';
import { getCheckNodeReturn } from '../helpers/getCheckNodeReturn';

export const checkFunctionDeclarationType: CheckAstNode<
  AstNodeName.FunctionDeclarationType
> = (context, functionDeclaration) => {
  const { context: parametersContext, nodeTypes: parametersTypes } =
    checkAstNodes(context, functionDeclaration.parameters, checkAstNode);

  const { nodeType: returnType, ...returnContext } = checkAstNode(
    parametersContext,
    functionDeclaration.return,
  );

  return getCheckNodeReturn(returnContext, {
    name: AstCheckerTypeName.Function,
    parameters: parametersTypes,
    return: returnType,
    hasValue: returnType.hasValue,
  });
};
