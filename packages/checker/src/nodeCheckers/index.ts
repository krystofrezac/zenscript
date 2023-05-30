import type { CheckAstNode } from '../types';
import { checkBlockNode } from './block';
import { checkFunctionCall } from './functionCall';
import { checkFunctionDeclarationExpression } from './functionDeclaration/expression';
import { checkNumberExpressionNode } from './numberExpression';
import { checkStringExpressionNode } from './stringExpression';
import { checkTupleNode } from './tuple';
import { checkVariableAssignmentNode } from './variableAssignment/variableAssignment';
import { checkIdentifierNode } from './identifier';
import { checkStringTypeNode } from './stringType';
import { checkNumberTypeNode } from './numberType';
import { checkFunctionDeclarationType } from './functionDeclaration/type';
import { checkRecordEntryAccessNode } from './recordEntryAccess';
import { checkRecordExpressionNode } from './record/expression';
import { checkRecordTypeNode } from './record/type';
import { AstNodeName } from '@zen-script/ast';
import { checkExportedVariableAssignmentNode } from './variableAssignment/exportedVariableAssignment';
import { checkImportExpressionNode } from './importExpression';

export const checkAstNode: CheckAstNode = (context, astNode) => {
  const actionMap: Partial<{
    [Name in AstNodeName]: CheckAstNode<Name>;
  }> = {
    [AstNodeName.File]: checkBlockNode,
    [AstNodeName.Block]: checkBlockNode,

    [AstNodeName.ImportExpression]: checkImportExpressionNode,

    [AstNodeName.NumberExpression]: checkNumberExpressionNode,
    [AstNodeName.NumberType]: checkNumberTypeNode,

    [AstNodeName.StringExpression]: checkStringExpressionNode,
    [AstNodeName.StringType]: checkStringTypeNode,

    [AstNodeName.TupleExpression]: checkTupleNode(true),
    [AstNodeName.TupleType]: checkTupleNode(true),

    [AstNodeName.RecordExpression]: checkRecordExpressionNode,
    [AstNodeName.RecordType]: checkRecordTypeNode,

    [AstNodeName.RecordEntryAccessExpression]: checkRecordEntryAccessNode,
    [AstNodeName.RecordEntryAccessType]: checkRecordEntryAccessNode,

    [AstNodeName.FunctionDeclarationExpression]:
      checkFunctionDeclarationExpression,
    [AstNodeName.FunctionDeclarationType]: checkFunctionDeclarationType,

    [AstNodeName.FunctionCallExpression]: checkFunctionCall,

    [AstNodeName.VariableAssignment]: checkVariableAssignmentNode,
    [AstNodeName.ExportedVariableAssignment]:
      checkExportedVariableAssignmentNode,

    [AstNodeName.IdentifierExpression]: checkIdentifierNode,
    [AstNodeName.IdentifierType]: checkIdentifierNode,
  };

  const action = actionMap[astNode.name] as CheckAstNode;
  if (!action)
    throw new Error(`action not implemented for '${astNode.name}' node`);
  return action(context, astNode);
};
