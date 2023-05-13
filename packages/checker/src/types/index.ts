import type { AstNode, AstNodeName } from '@zen-script/ast';
import type { AstCheckerError } from './errors';
import type { AstCheckerType } from './types';

export type Variable = {
  variableName: string;
  variableType: AstCheckerType;
};
export type VariableScope = Variable[];

export type AstCheckerContext = {
  errors: AstCheckerError[];
  exportedVariables: Variable[];
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
