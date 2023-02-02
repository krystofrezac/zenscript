import ohm from "ohm-js";
import { findVariableFromCurrentScope, addError, pushTypeScope, popTypeScope } from "../checker/checkerContext";
import { areTypeCompatible } from "../checker/helpers/areTypesCompatible";
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
      })
    },
    EmptyListOf() {
      return createType({
        type: "tuple", 
        items: []
      })
    }, 
    stringExpression(_startQuotes, _string, _endQuotes) {
      return createType({
        type: "string",
      })
    },
    numberExpression(_number){
      return createType({
        type: "number",
      })
    },
    identifier(identifier) {
      const name = identifier.sourceString
      const referencedVariable = findVariableFromCurrentScope(context, name)

      if(!referencedVariable) {
        addError(context, {message: `Variable with name '${name}' could not be found`})
        return createType({type: "unknown"})
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
      }) 
    },
    stringType(_) {
      return createType({
        type: "string"
      }) 
    },
    Block(_startCurly, statements, _endCurly) {
      pushTypeScope(context)
      const types = statements.getTypes()
      popTypeScope(context)
      const lastStatementType = types[types.length-1]
      if(!lastStatementType)
        return createType({type: "unknown"})

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
      })
    },
    FunctionCall_firstCallCompilerHook(_compilerHook, _startBrace, _parameters ,_endBrace) {
      return createType({type: "unknown"}) 
    },
    FunctionCall_firstCall(identifier, _startBrace, parameters, _endBrace) {
      const functionType = identifier.getType()
      const parametersType = parameters.getType()

      if(functionType.type!=="function"){
        addError(context, {message: `Variable '${identifier.sourceString}' is not callable`})
        return createType({type: 'unknown'});
      }

      if(!parameters.getHasValue()) {
        addError(context, {message: `Some parameters don't have value`})
        return createType({type: 'unknown'});
      } 

      if(!areTypeCompatible(functionType.parameters, parametersType)){
        addError(context, {message: `You are calling function ${identifier.sourceString} with wrong arguments`+
          `\n${JSON.stringify(functionType.parameters)}`+
          `\n${JSON.stringify(parametersType)}`}
        )
        return createType({type: 'unknown'});
      }

      return createType(functionType.returns)
    },
  })