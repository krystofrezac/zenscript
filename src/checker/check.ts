import ohm, { MatchResult } from "ohm-js";
import grammar from "../grammar.ohm-bundle";
import { findVariableInCurrentScope } from "./helpers/findVariableInCurrenScope";
import { Type, TypeScope, Error } from "./types";


const typeScopes: TypeScope[] = [{
  variables: []
}]
const errors: Error[] = []
const addVariableToCurrentScope = (name: string, type: Type)=>{
  typeScopes[typeScopes.length-1].variables.push({name, type: type})
}
const findVariableFromCurrentScope = (name: string)=>{
  return typeScopes.flatMap(typeScope=>typeScope.variables).reverse().find(variable=>variable.name===name)
}
const addError = (error: Error)=>{
  errors.push(error)
}
const deepCompare = <T>(a: T, b: T)=>{
 return JSON.stringify(a)===JSON.stringify(b)
}

const createType = (type: Type)=>type

const checkVariable = (name: string, implicitType: Type, explicitType?: Type) =>{
  if(findVariableInCurrentScope(typeScopes, name)){
    addError({message: `variable with name '${name}' is already declared in this scope`})
    return
  }
  if(explicitType && !deepCompare(implicitType, explicitType)){
    addError({message: `variable '${name}' has incorrect type ${JSON.stringify(implicitType)} expected ${JSON.stringify(explicitType)}`})
  }

  addVariableToCurrentScope(name, explicitType??implicitType)
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
    })
  },
  numberExpression(_number){
    return createType({
      type: "number"
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
    return createType({type: "number"}) 
  },
  stringType(_) {
    return createType({type: "string"}) 
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
    const variableName = identifier.sourceString
    const implicitType = valueAssignment.getType()

    if(!implicitType) return

    checkVariable(variableName, implicitType)
  },
  VariableDeclaration_valueAndType(identifier, type, valueAssignment) {
    const variableName = identifier.sourceString
    const implicitType = valueAssignment.getType()
    const explicitType = type.getType()

    if(!implicitType) return

    checkVariable(variableName, implicitType, explicitType)
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