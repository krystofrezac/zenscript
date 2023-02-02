import ohm from "ohm-js";
import { findVariableFromCurrentScope, addError, pushTypeScope, popTypeScope } from "../checker/checkerContext";
import { createType } from "../checker/helpers/createType";
import { CheckerContext } from "../checker/types";
import { BoringLangSemantics } from "../grammar.ohm-bundle";

type CreateGetTypeOperationOptions = {
  checkerContext: CheckerContext
}

export const createGetTypeOperation = (
    semantics: BoringLangSemantics, 
    {checkerContext: context}: CreateGetTypeOperationOptions
  ) =>
  semantics.addOperation<ReturnType<ohm.Node['getType']>>("getType", {
    NonemptyListOf(firstItem, _firstItemIterable, tailIterable) {
      return createType({
        type: "tuple",
        items: [firstItem.getType(), ...tailIterable.getTypes()],
        hasValue: false
      })
    },
    stringExpression(_startQuotes, _string, _endQuotes) {
      return createType({
        type: "string",
        hasValue: true
      })
    },
    numberExpression(_number){
      return createType({
        type: "number",
        hasValue: true 
      })
    },
    identifier(identifier) {
      const name = identifier.sourceString
      const referencedVariable = findVariableFromCurrentScope(context, name)

      if(!referencedVariable) {
        addError(context, {message: `Variable with name '${name}' could not be found`})
        return createType({type: "unknown", hasValue: false})
      }

      return referencedVariable?.type;
    },
    ValueAssignment(_equals, expression) {
      return expression.getType() 
    },
    TypeAssignment(_colon, type) {
      return type.getType() 
    },
    numberType(_) {
      return createType({
        type: "number", 
        hasValue: false
      }) 
    },
    stringType(_) {
      return createType({
        type: "string",
        hasValue: false
      }) 
    },
    Block(_startCurly, statements, _endCurly) {
      pushTypeScope(context)
      const types = statements.getTypes()
      popTypeScope(context)
      const lastStatementType = types[types.length-1]
      if(!lastStatementType)
        return createType({type: "unknown", hasValue: false})

      return lastStatementType
    },
    BlockStatement_statements(statement, _emptyLines, otherStatements) {
      statement.checkType() 
      return otherStatements.getType()
    },
    BlockStatement_endStatement(expression) {
      return expression.getType()
    },
    FunctionDeclaration(_startBrace, parameters, _nedBrace, returnExpression) {
      const returnType = returnExpression.getType()

      return createType({
        type: "function", 
        parameters: parameters.getType(),
        returns: returnType,
        hasValue: returnType.hasValue
      })
    },
    FunctionCall_firstCallCompilerHook(_compilerHook, _startBrace, _parameters ,_endBrace) {
      return createType({type: "unknown", hasValue: true}) 
    },
  })