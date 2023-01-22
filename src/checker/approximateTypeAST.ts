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
    type: "block",
    body: StatementItem | StatementItem[]
  }  
  | {
    type: "functionCall",
    typeOfCalledExpression: TypeTree,
    arguments: TypeTree[],
  }
  | {
    type: "function",
    parameters: string[],
    returns: TypeTree
  }

type StatementItem = {
    name: string,
    explicitType: TypeTree,
    implicitType: TypeTree
  } 
  | {
    implicitType: TypeTree
  }

declare module 'ohm-js' {
  interface Node {
    getType: () => TypeTree|TypeTree[];
    getStatementItemInfo: () => StatementItem|StatementItem[]
  }
}

const semantics = grammar.createSemantics()

const toArray = <T>(item: T | T[]) => Array.isArray(item) ? item : [item]

const createType = (type: TypeTree)=>type
const createStatementItem = (item: StatementItem) => item

semantics.addOperation<ReturnType<ohm.Node['getType']>>("getType", {
  _iter(...children) {
    return children.flatMap(c=>c.getType())
  },
  _terminal(){
    return []
  },
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
  Block(_startCurly, _emptyLines, blockStatement, _endCurly) {
    return createType({ type: "block", body: blockStatement.getStatementItemInfo()})
  },
  FunctionDeclaration(_startBrace, parameters, _endBrace, expression) {
    return createType({
      type: "function",
      parameters: parameters.sourceString.split(",").map(parameter=>parameter.trim()),
      returns: expression.getType() as TypeTree
    }) 
  },
  FunctionCall_firstCall(identifier, _startBrace, passedArguments, _endBrace) {
    return createType({
      type: "functionCall", 
      typeOfCalledExpression: identifier.getType() as TypeTree, 
      arguments: toArray(passedArguments.getType())
    }) 
  },
  FunctionCall_chainedCall(previousCall, _startBrace, passedArgument, _endBrace) {
    return createType({
      type: "functionCall", 
      typeOfCalledExpression: previousCall.getType() as TypeTree, 
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
    return toArray(statement.getStatementItemInfo())
  },
  VariableDeclaration_onlyValue(identifier, valueAssignment) {
    return createStatementItem({
      name: identifier.sourceString,
      implicitType: valueAssignment.getType() as TypeTree
    })
  },
  VariableDeclaration_valueAndType(identifier, type, valueAssignment) {
    return createStatementItem({
      name: identifier.sourceString,
      implicitType: valueAssignment.getType() as TypeTree,
      explicitType: type.getType() as TypeTree
    })
  },
  Expression(expression) {
    return createStatementItem({implicitType: expression.getType() as TypeTree}) 
  },
  BlockStatement_statements(statement, _emptyLines, blockStatement) {
    return [statement.getStatementItemInfo(), blockStatement.getStatementItemInfo()].flat()
  },
  BlockStatement_endStatement(expression, _emptyLines) {
    return expression.getStatementItemInfo()
  },
})

/**
 * AST with types that are readable from source code
 */
export const getApproximateTypeAST = (parsedInput: MatchResult) => {
  if(parsedInput.succeeded()){
    const adapter = semantics(parsedInput)
    return adapter.getStatementItemInfo()
  } else {
    console.error("Failed to parse", parsedInput.message);
    return undefined;
  }
}