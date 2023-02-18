import { TypeTreeNode, TypeTreeNodeName } from '../../getTypeTree/types';
import { TypeTreeCheckerError } from './errors';
import { CheckerType } from './types';

export type Variable = {
  variableName: string;
  variableType: CheckerType;
};
type VariableScope = Variable[];

export type TypeTreeCheckerContext = {
  errors: TypeTreeCheckerError[];
  variableScopes: VariableScope[];
};
export type CheckTypeTreeNodeReturn = TypeTreeCheckerContext & {
  nodeType: CheckerType;
};
export type CheckTypeTreeNode<
  TNodeName extends TypeTreeNodeName = TypeTreeNodeName,
> = (
  context: TypeTreeCheckerContext,
  typeTreeNode: TypeTreeNode & { name: TNodeName },
) => CheckTypeTreeNodeReturn;
