import ohm, { MatchResult } from "ohm-js";
import grammar from "../grammar.ohm-bundle";
import { findVariableInCurrentScope } from "./helpers/findVariableInCurrenScope";
import { Type, TypeScope, Error, Variable } from "./types";


const typeScopes: TypeScope[] = [{
  variables: []
}]
const errors: Error[] = []
const addVariableToCurrentScope = (variable: Variable)=>{
  typeScopes[typeScopes.length-1].variables.push(variable)
}
const findVariableFromCurrentScope = (name: string)=>{
  return typeScopes.flatMap(typeScope=>typeScope.variables).reverse().find(variable=>variable.name===name)
}
const addError = (error: Error)=>{
  errors.push(error)
}

const createType = (type: Type)=>type

const typesAreCompatible = (a: Type, b: Type)=>{
  if(a.type==="string" && b.type==="string") return true
  if(a.type==="number" && b.type==="number") return true

  // TODO: function
  return false
}

const checkVariableAssignmentTypeAndRegister = ({
  name,
  primaryType, 
  secondaryType,
} : {
    name: string, 
    primaryType: Type, 
    secondaryType?: Type,
}) =>{
  if(findVariableInCurrentScope(typeScopes, name)){
    addError({message: `variable with name '${name}' is already declared in this scope`})
    return
  }
  if(secondaryType && !typesAreCompatible(primaryType, secondaryType)){
    addError({message: `variable '${name}' has incorrect type ${JSON.stringify(primaryType)} expected ${JSON.stringify(secondaryType)}`})
  }

  addVariableToCurrentScope({
    name, 
    type: {
      ...primaryType,
      hasValue: secondaryType?.hasValue || primaryType.hasValue
    } 
  })
}

declare module 'ohm-js' {
  interface Node {
    getType: () => Type|undefined
    check: () => void
  }
}
const semantics = grammar.createSemantics()
semantics.addOperation<ReturnType<ohm.Node['getType']>>("getType", {
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
    const referencedVariable = findVariableFromCurrentScope(name)

    if(!referencedVariable) 
      addError({message: `Variable with name '${name}' could not be found`})

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
})


semantics.addOperation<ReturnType<ohm.Node['check']>>("check", {
  _iter(...children) {
    children.forEach(c => c.check())
  },
  Program_statements(firstStatement, _emptyLines, secondStatement) {
    firstStatement.check()
    secondStatement.check()
  },
  Program_wrappedInEmptyLines(_startEmptyLInes, statement, _endEmptyLines) {
    statement.check()
  },
  VariableDeclaration_onlyValue(identifier, valueAssignment) {
    const name = identifier.sourceString
    const valueType = valueAssignment.getType()

    if(!valueType) return

    if(!valueType.hasValue)
      addError({message: `Cannot assign expression without value to variable '${name}'`})

    checkVariableAssignmentTypeAndRegister({name, primaryType: valueType })
  },
  VariableDeclaration_onlyType(identifier, typeAssignment) {
    const name = identifier.sourceString
    const type = typeAssignment.getType()

    if(!type) return

    checkVariableAssignmentTypeAndRegister({name, primaryType: type })
  },
  VariableDeclaration_valueAndType(identifier, typeAssignment, valueAssignment) {
    const name = identifier.sourceString
    const type = typeAssignment.getType()
    const valueType = valueAssignment.getType()

    if(!valueType) return
    if(!valueType.hasValue)
      addError({message: `Cannot assign expression without value to variable '${name}'`})

    if(!type) return

    checkVariableAssignmentTypeAndRegister({name, primaryType: type, secondaryType: valueType })
  },
  FunctionCall_firstCall(identifier, _startBrace, parameters, _endBrace) {
    const functionName = identifier.sourceString  

    const functionDeclaration = findVariableFromCurrentScope(functionName)

    if(!functionDeclaration){
      addError({message: `Cannot find variable with name '${functionName}'`})
    }
    if(functionDeclaration?.type.type!=="function"){
      addError({message: `Variable is not '${functionName}' a function`})
    }

    // TODO: finish when function declaration is ready
  },
})

export const check = (parsedInput: MatchResult) => {
  if(parsedInput.succeeded()){
    const adapter = semantics(parsedInput)
    adapter.check()
    console.log(errors)
  } else {
    console.error("Failed to parse", parsedInput.message);
    return undefined;
  }
}