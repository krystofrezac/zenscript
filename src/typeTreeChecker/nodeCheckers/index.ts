import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { checkBlockNode } from './block';
import { checkFunctionDeclaration } from './functionDeclaration';
import { checkNumberNode } from './number';
import { checkStringNode } from './string';
import { checkVariableAssignmentNode } from './variableAssignment';
import { checkVariableReferenceNode } from './variableReference';

export const checkTypeTreeNode: CheckTypeTreeNode = (context, typeTree) => {
  const actionMap: Partial<{
    [Name in TypeTreeNodeName]: CheckTypeTreeNode<Name>;
  }> = {
    [TypeTreeNodeName.Number]: checkNumberNode,
    [TypeTreeNodeName.String]: checkStringNode,

    [TypeTreeNodeName.Block]: checkBlockNode,

    [TypeTreeNodeName.FunctionDeclaration]: checkFunctionDeclaration,

    [TypeTreeNodeName.VariableAssignment]: checkVariableAssignmentNode,
    [TypeTreeNodeName.VariableReference]: checkVariableReferenceNode,
  };

  const action = actionMap[typeTree.name] as CheckTypeTreeNode;
  if (!action)
    throw new Error(`action not implemented for '${typeTree.name}' node`);
  return action(context, typeTree);
};
