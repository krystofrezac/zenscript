import ohm, { MatchResult } from "ohm-js";
import grammar from "../grammar.ohm-bundle";
import { findVariableInCurrentScope } from "./helpers/findVariableInCurrenScope";
import { Type, TypeScope, Error, Variable } from "./types";

const typeScopes: TypeScope[] = [{
  variables: []
}]
const pushTypeScope = ()=>{
  typeScopes.push({variables: []})
}
const popTypeScope = ()=>{
  typeScopes.pop()
}
const errors: Error[] = []
const addVariableToCurrentScope = (variable: Variable)=>{
  const lastScope = typeScopes[typeScopes.length-1]
  if(lastScope)
    lastScope.variables.push(variable)
}
const findVariableFromCurrentScope = (name: string)=>{
  return typeScopes.flatMap(typeScope=>typeScope.variables).reverse().find(variable=>variable.name===name)
}
const addError = (error: Error)=>{
  errors.push(error)
}

const createType = (type: Type)=>type

const typesAreCompatible = (base: Type, compare: Type)=>{
  if(compare.type==="unknown") return true
  if(base.type==="string" && compare.type==="string") return true
  if(base.type==="number" && compare.type==="number") return true

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
    getType: () => Type
    getTypes: () => (Type)[]
    check: () => void
  }
}
const semantics = grammar.createSemantics()
semantics.addOperation<ReturnType<ohm.Node['getTypes']>>("getTypes", {
  _iter(...children) {
    return children.map(ch=>ch.getType())
  },
  _terminal() {
    return []
  }
})
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
    const referencedVariable = findVariableFromCurrentScope(name)

    if(!referencedVariable) {
      addError({message: `Variable with name '${name}' could not be found`})
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
    pushTypeScope()
    const types = statements.getTypes()
    popTypeScope()
    const lastStatementType = types[types.length-1]
    if(!lastStatementType)
      return createType({type: "unknown", hasValue: false})

    return lastStatementType
  },
  BlockStatement_statements(statement, _emptyLines, otherStatements) {
    statement.check() 
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


semantics.addOperation<ReturnType<ohm.Node['check']>>("check", {
  _iter(...children) {
    children.forEach(c => c.check())
  },
  Program_statements(firstStatement, _emptyLines, secondStatement) {
    firstStatement.check()
    secondStatement.check()
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
})

export const check = (parsedInput: MatchResult) => {
  if(parsedInput.succeeded()){
    const adapter = semantics(parsedInput)
    adapter.check()
    console.log(JSON.stringify(typeScopes, undefined, 2))
    console.log(errors)
    return errors.length===0;
  } else {
    console.error("Failed to parse", parsedInput.message);
    return false;
  }
}