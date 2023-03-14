import { TypeTreeNodeName } from '../../getTypeTree/types';
import { CheckTypeTreeNode } from '../types';
import { checkBlockNode } from './block';
import { checkFunctionCall } from './functionCall';
import { checkFunctionDeclaration } from './functionDeclaration';
import { checkNumberNode } from './number';
import { checkParameter } from './parameter';
import { checkStringNode } from './string';
import { checkTupleNode } from './tuple';
import { checkVariableAssignmentNode } from './variableAssignment';
import { checkVariableReferenceNode } from './variableReference';

export const checkTypeTreeNode: CheckTypeTreeNode = (context, typeTree) => {
  const actionMap: Partial<{
    [Name in TypeTreeNodeName]: CheckTypeTreeNode<Name>;
  }> = {
    [TypeTreeNodeName.Number]: checkNumberNode,
    [TypeTreeNodeName.String]: checkStringNode,

    [TypeTreeNodeName.Block]: checkBlockNode,
    [TypeTreeNodeName.Tuple]: checkTupleNode,

    [TypeTreeNodeName.FunctionDeclaration]: checkFunctionDeclaration,
    [TypeTreeNodeName.FunctionCall]: checkFunctionCall,
    [TypeTreeNodeName.Parameter]: checkParameter,

    [TypeTreeNodeName.VariableAssignment]: checkVariableAssignmentNode,
    [TypeTreeNodeName.VariableReference]: checkVariableReferenceNode,
  };

  const action = actionMap[typeTree.name] as CheckTypeTreeNode;
  if (!action)
    throw new Error(`action not implemented for '${typeTree.name}' node`);
  return action(context, typeTree);
};
