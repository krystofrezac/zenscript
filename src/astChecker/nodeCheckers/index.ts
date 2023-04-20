import { AstNodeName } from '../../ast/types';
import { CheckAstNode } from '../types';
import { checkBlockNode } from './block';
import { checkFunctionCall } from './functionCall';
import { checkFunctionDeclaration } from './functionDeclaration';
import { checkNumberNode } from './number';
import { checkParameter } from './parameter';
import { checkRecordNode } from './record';
import { checkRecordEntryAccessNode } from './recordEntryAccess';
import { checkStringNode } from './string';
import { checkTupleNode } from './tuple';
import { checkVariableAssignmentNode } from './variableAssignment';
import { checkIdentifierNode } from './identifier';

export const checkAstNode: CheckAstNode = (context, astNode) => {
  const actionMap: Partial<{
    [Name in AstNodeName]: CheckAstNode<Name>;
  }> = {
    [AstNodeName.Number]: checkNumberNode,
    [AstNodeName.String]: checkStringNode,

    [AstNodeName.Block]: checkBlockNode,

    [AstNodeName.TupleExpression]: checkTupleNode(true),
    [AstNodeName.TupleType]: checkTupleNode(true),

    [AstNodeName.Record]: checkRecordNode,
    [AstNodeName.RecordEntryAccess]: checkRecordEntryAccessNode,

    [AstNodeName.FunctionDeclaration]: checkFunctionDeclaration,
    [AstNodeName.FunctionCall]: checkFunctionCall,
    [AstNodeName.Parameter]: checkParameter,

    [AstNodeName.VariableAssignment]: checkVariableAssignmentNode,

    [AstNodeName.IdentifierExpression]: checkIdentifierNode,
    [AstNodeName.IdentifierType]: checkIdentifierNode,
  };

  const action = actionMap[astNode.name] as CheckAstNode;
  if (!action)
    throw new Error(`action not implemented for '${astNode.name}' node`);
  return action(context, astNode);
};
