import { TypeTreeNode, TypeTreeNodeName } from '../../getTypeTree/types';
import { TypeTreeCheckerError } from './errors';
import { CheckerType } from './types';

export type Variable = {
  variableName: string;
  variableType: CheckerType;
};
export type VariableScope = Variable[];

export type TypeTreeCheckerContext = {
  errors: TypeTreeCheckerError[];
  variableScopes: VariableScope[];
  functionIdCounter: number;
};
export type CheckTypeTreeNodeReturn<
  TNodeType extends CheckerType = CheckerType,
> = TypeTreeCheckerContext & {
  nodeType: TNodeType;
};
export type CheckTypeTreeNode<
  TNodeName extends TypeTreeNodeName = TypeTreeNodeName,
> = (
  context: TypeTreeCheckerContext,
  typeTreeNode: TypeTreeNode & { name: TNodeName },
) => CheckTypeTreeNodeReturn;
