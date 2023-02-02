import ohm from "ohm-js";
import { findVariableFromCurrentScope } from "../checker/checkerContext";
import { CheckerContext } from "../checker/types";
import { BoringLangSemantics } from "../grammar.ohm-bundle";

type CreateHasValueOperationOptions = {
  checkerContext: CheckerContext
}

export const createHasValueOperation = (
    semantics: BoringLangSemantics, 
    {checkerContext: context}: CreateHasValueOperationOptions 
  )=>
  semantics.addOperation<ReturnType<ohm.Node['getHasValue']>>("getHasValue", {
    _iter(...children){
      return children.every(ch=>{
        console.log(ch.sourceString)
        return ch.getHasValue()
      })
    },
    NonemptyListOf(firstItem, _firstItemIterable, tailIterable) {
      return firstItem.getHasValue() && tailIterable.getHasValue()
    },
    EmptyListOf() {
      return true
    },
    identifier(identifier) {
      const variable = findVariableFromCurrentScope(context, identifier.sourceString)
      if(!variable) return false
      return variable.hasValue
    },
    VariableDeclaration_onlyType(_identifier, _typeAssignment) {
      return false 
    },
    VariableDeclaration_onlyValue(_identifier, _valueAssignment) {
      return true 
    },
    VariableDeclaration_valueAndType(_identifier, _typeAssignment, _valueAssignment) {
      return true 
    },
    ValueAssignment(_assignmentOperator, expression) {
      return expression.getHasValue() 
    },
    stringExpression(_startQuotes, _content, _endQuotes) {
      return true 
    },
    numberExpression(number) {
      return true 
    },
    FunctionCall_firstCallCompilerHook(hookName, _startBracket, _arguments, _endBracket) {
      return hookName.sourceString==="@jsFunction"
    },
    FunctionCall_firstCall(identifier, _startBracket, _arguments, _endBracket) {
      const functionDeclaration = findVariableFromCurrentScope(context, identifier.sourceString) 
      if(!functionDeclaration) return false
      return functionDeclaration.hasValue
    },
  })