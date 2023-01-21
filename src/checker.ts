import ohm, { MatchResult } from "ohm-js";
import grammar from "./grammar.ohm-bundle";

type Type = {
    type: "string" | "number";
  } 
  | {
    type: "referenceToVariable",
    variableName: string
  }  
  | {
    type: "block",
    body: StatementItem | StatementItem[]
  }  
  | {
    type: "functionCall",
    typeOfCalledExpression: Type,
    arguments: Type[],
  }
  | {
    type: "function",
    parameters: string[],
    returns: Type
  }

type StatementItem = {
  name: string,
  statementType: Type
  } 
  | {
    statementType: Type
  }

declare module 'ohm-js' {
  interface Node {
    getType: () => Type|Type[];
    getStatementItemInfo: () => StatementItem|StatementItem[]
  }
}

const semantics = grammar.createSemantics()

const toArray = <T>(item: T | T[]) => Array.isArray(item) ? item : [item]

const createType = (type: Type)=>type
const createStatementItem = (item: StatementItem) => item

semantics.addOperation<ReturnType<ohm.Node['getType']>>("getType", {
  _iter(...children) {
    return children.flatMap(c=>c.getType())
  },
  _terminal(){
    return []
  },
  string(_startQuotes, _string, _endQuotes) {
    return createType({
      type: "string",
    })
  },
  number(_number){
    return createType({
      type: "number"
    })
  },
  identifier(name) {
    return createType({type: "referenceToVariable", variableName: name.sourceString}) 
  },
  Block(_startCurly, _emptyLines, blockStatement, _endCurly) {
    return createType({ type: "block", body: blockStatement.getStatementItemInfo()})
  },
  FunctionDeclaration(_startBrace, parameters, _endBrace, expression) {
    return createType({
      type: "function",
      parameters: parameters.sourceString.split(",").map(parameter=>parameter.trim()),
      returns: expression.getType() as Type
    }) 
  },
  FunctionCall_firstCall(identifier, _startBrace, passedArguments, _endBrace) {
    return createType({
      type: "functionCall", 
      typeOfCalledExpression: identifier.getType() as Type, 
      arguments: toArray(passedArguments.getType())
    }) 
  },
  FunctionCall_chainedCall(previousCall, _startBrace, passedArgument, _endBrace) {
    return createType({
      type: "functionCall", 
      typeOfCalledExpression: previousCall.getType() as Type, 
      arguments: toArray(passedArgument.getType())
    })
  },
  FunctionArguments_arguments(argument, _comma, resetArguments) {
    return [argument.getType(), resetArguments.getType()].flat()
  },
})

semantics.addOperation<ReturnType<ohm.Node['getStatementItemInfo']>>("getStatementItemInfo", {
  _iter(...children) {
    return children.flatMap(c => {
      return c.getStatementItemInfo()
    })
  },
  _terminal(){
    return []
  },
  Program_statements(firstStatement, _emptyLines, secondStatement) {
    const res = [firstStatement.getStatementItemInfo(), secondStatement.getStatementItemInfo()]
    return res.flat();
  },
  Program_wrappedInEmptyLines(_startEmptyLInes, statement, _endEmptyLines) {
    return statement.getStatementItemInfo()
  },
  VariableDeclaration(identifier, _equals, expression) {
    return createStatementItem({
      name: identifier.sourceString,
      statementType: expression.getType() as Type
    })
  },
  Expression(expression) {
    return createStatementItem({statementType: expression.getType() as Type}) 
  },
  BlockStatement_statements(statement, _emptyLines, blockStatement) {
    return [statement.getStatementItemInfo(), blockStatement.getStatementItemInfo()].flat()
  },
  BlockStatement_endStatement(expression, _emptyLines) {
    return expression.getStatementItemInfo()
  },
})

export const check = (parsedInput: MatchResult) => {
  if(parsedInput.succeeded()){
    const adapter = semantics(parsedInput)
    return adapter.getStatementItemInfo()
  } else {
    console.error("Failed to parse", parsedInput.message);
    return undefined;
  }
}