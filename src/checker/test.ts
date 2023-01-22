import ohm, { MatchResult } from "ohm-js";
import grammar from "../grammar.ohm-bundle";

type TypeTree = {
    type: "string" | "number";
  } 
  | {
    type: "referenceToVariable",
    variableName: string
  }
  | {
    type: "function",
    parameters: string[],
    returns: TypeTree
  }

declare module 'ohm-js' {
  interface Node {
    getType: () => TypeTree
    check: () => void
  }
}

const semantics = grammar.createSemantics()

type TypeScope = {
  variables: {
    name: string, 
    implicitType: TypeTree
  }[]
}
type Error = {
  message: string
}

const typeScopes: TypeScope[] = [{
  variables: []
}]
const errors: Error[] = []
const addVariableToCurrentScope = (name: string, type: TypeTree)=>{
  typeScopes[typeScopes.length-1].variables.push({name, implicitType: type})
}
const findVariableFromCurrentScope = (name: string)=>{
  const typeScope = typeScopes[typeScopes.length-1]
  const foundVariable = typeScope.variables.find(variable=>variable.name===name)
  if(foundVariable) return foundVariable
  return undefined
}
const addError = (error: Error)=>{
  errors.push(error)
}
const deepCompare = <T>(a: T, b: T)=>{
 return JSON.stringify(a)===JSON.stringify(b)
}

const createType = (type: TypeTree)=>type

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
  identifier(name) {
    return createType({type: "referenceToVariable", variableName: name.sourceString}) 
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
  FunctionDeclaration(_startBrace, parameters, _endBrace, expression) {
    return createType({
      type: "function",
      parameters: parameters.sourceString.split(",").map(parameter=>parameter.trim()),
      returns: expression.getType() as TypeTree
    }) 
  },
})

const checkVariable = (name: string, implicitType: TypeTree, explicitType?: TypeTree) =>{
  if(findVariableFromCurrentScope(name)){
    addError({message: `variable with name '${name}' is already declared in this scope`})
    return
  }
  if(explicitType && !deepCompare(implicitType, explicitType)){
    addError({message: `variable '${name}' has incorrect type ${JSON.stringify(implicitType)} expected ${JSON.stringify(explicitType)}`})
  }

  addVariableToCurrentScope(name, explicitType??implicitType)
}

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

    checkVariable(variableName, implicitType)
  },
  VariableDeclaration_valueAndType(identifier, type, valueAssignment) {
    const variableName = identifier.sourceString
    const implicitType = valueAssignment.getType()
    const explicitType = type.getType()

    checkVariable(variableName, implicitType, explicitType)
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