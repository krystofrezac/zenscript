import { AstNode, AstNodeName } from '../../ast/types';
import { AstCheckerError } from './errors';
import { AstCheckerType } from './types';

export type Variable = {
  variableName: string;
  variableType: AstCheckerType;
};
export type VariableScope = Variable[];

export type AstCheckerContext = {
  errors: AstCheckerError[];
  variableScopes: VariableScope[];
  figureOutId: number;
};
export type CheckAstNodeReturn<
  TNodeType extends AstCheckerType = AstCheckerType,
> = AstCheckerContext & {
  nodeType: TNodeType;
};
export type CheckAstNode<TNodeName extends AstNodeName = AstNodeName> = (
  context: AstCheckerContext,
  astNode: AstNode & { name: TNodeName },
) => CheckAstNodeReturn;
