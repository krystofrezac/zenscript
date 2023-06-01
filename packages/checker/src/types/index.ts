import type { AstNode, AstNodeName } from '@zen-script/ast';
import type { AstCheckerError } from './errors';
import type { AstCheckerType } from './types';
import type { CheckAstResult } from '..';

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
  filePath: string;
  importFile: (
    currentFilePath: string,
    requestedFilePath: string,
  ) => CheckAstResult | undefined;
};
export type CheckAstNodeReturn<
  TNodeType extends AstCheckerType = AstCheckerType,
> = AstCheckerContext & {
  nodeType: TNodeType;
};
export type CheckAstNode<
  TNodeName extends AstNodeName = AstNodeName,
  TReturnNodeType extends AstCheckerType = AstCheckerType,
> = (
  context: AstCheckerContext,
  astNode: AstNode & { name: TNodeName },
) => CheckAstNodeReturn<TReturnNodeType>;
