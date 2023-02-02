import ohm from "ohm-js"
import { addError } from "../checker/checkerContext"
import { checkVariableAssignmentTypeAndRegister } from "../checker/helpers/checkVariableAssignmentTypeAndRegister"
import { CheckerContext } from "../checker/types"
import { BoringLangSemantics } from "../grammar.ohm-bundle"


type CreateCheckTypeOperationOptions = {
  checkerContext: CheckerContext
}

export const createCheckTypeOperation = (
    semantics: BoringLangSemantics, 
    {checkerContext: context}: CreateCheckTypeOperationOptions 
  )=>
  semantics.addOperation<ReturnType<ohm.Node['checkType']>>("checkType", {
    _iter(...children) {
      children.forEach(c => c.checkType())
    },
    Program_statements(firstStatement, _emptyLines, secondStatement) {
      firstStatement.checkType()
      secondStatement.checkType()
    },
    VariableDeclaration_onlyValue(identifier, valueAssignment) {
      const name = identifier.sourceString
      const valueType = valueAssignment.getType()

      if(!valueType) return

      if(!valueAssignment.getHasValue())
        addError( context, {message: `Cannot assign expression without value to variable '${name}'`})

      checkVariableAssignmentTypeAndRegister(context, {name, primaryType: valueType, hasValue: true })
    },
    VariableDeclaration_onlyType(identifier, typeAssignment) {
      const name = identifier.sourceString
      const type = typeAssignment.getType()

      if(!type) return

      checkVariableAssignmentTypeAndRegister(context, {name, primaryType: type, hasValue: false })
    },
    VariableDeclaration_valueAndType(identifier, typeAssignment, valueAssignment) {
      const name = identifier.sourceString
      const type = typeAssignment.getType()
      const valueType = valueAssignment.getType()

      if(!valueType) return
      if(!valueAssignment.getHasValue())
        addError(context, {message: `Cannot assign expression without value to variable '${name}'`})

      if(!type) return

      checkVariableAssignmentTypeAndRegister(context, {name, primaryType: type, secondaryType: valueType, hasValue: true })
    },
  })