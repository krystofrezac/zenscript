import { TypeScope } from "../types";

export const findVariableInCurrentScope = (typeScopes: TypeScope[], name: string)=>{
  const typeScope = typeScopes[typeScopes.length-1]
  if(!typeScope) return undefined
  const foundVariable = typeScope.variables.find(variable=>variable.name===name)
  if(foundVariable) return foundVariable
  return undefined
}