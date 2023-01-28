import { MatchResult, NonterminalNode } from "ohm-js";
import grammar from "./grammar.ohm-bundle";

const semantics = grammar.createSemantics()

const transpileJsExternalFunctionCall = (parameters: NonterminalNode)=>{
  const transpiledParameters = parameters.transpile() as string
  return transpiledParameters.substring(1, transpiledParameters.length - 1)
}

semantics.addOperation("transpile", {
  _iter(...children) {
    return children.map(c => c.transpile())
  },
  _terminal(){
    return this.sourceString
  },
  NonemptyListOf(items, a, b){
    return items.transpile() +  b.transpile()
  },
  Program_statements(firstStatement, _newLines, secondStatement){
    return firstStatement.transpile() + secondStatement.transpile()
  },
  Program_endStatement(statement){
    return statement.transpile()
  },
  Statement(statement){
    return statement.transpile()+"\n"
  },
  VariableDeclaration_onlyValue(identifier, valueAssignment){
    return `const ${identifier.sourceString} ${valueAssignment.transpile()}`
  },
  VariableDeclaration_valueAndType(identifier, _typeAssignment, valueAssignment){
    return `const ${identifier.sourceString} ${valueAssignment.transpile()}`
  },
  ValueAssignment(_equals, expression) {
    return `= ${expression.transpile()}`
  },
  identifier(identifier){
    return identifier.sourceString
  },
  numberExpression(number){
    return number.sourceString
  },
  stringExpression(_startQuotes, value, _endQuotes) {
    return '"' + value.sourceString + '"'
  },
  Block(_startCurlyBraces, blockStatements, _endCurlyBraces) {
    return "(()=>{\n"+blockStatements.transpile()+"\n})()"
  },
  BlockStatement_statements(statement, _emptyLines, blockStatement){
    return statement.transpile()+blockStatement.transpile()
  },
  BlockStatement_endStatement(expression){
    return "return "+expression.transpile()
  },
  FunctionDeclaration(_startBracket, parameters, _endBracket, expression) {
    return "("+parameters.transpile()+")=>"+expression.transpile()
  },
  FunctionParameters_parametr(parameter, _comma, otherParameters) {
    return parameter.transpile()+", "+ otherParameters.transpile()
  },
  FunctionParameters_noParametr(_) {
    return "" 
  },
  FunctionParametr(parametr) {
    return parametr.sourceString 
  },
  FunctionCall_firstCall(identifier, _startBracket, parameters, _endBracket) {
    const transpiledIdentifier = identifier.transpile()
    if(transpiledIdentifier === "jsExternal!")
      return transpileJsExternalFunctionCall(parameters)

    return transpiledIdentifier+"("+parameters.transpile()+")"
  },
  FunctionCall_chainedCall(prevFunctionCall, _startBracket, parameters, _endBracket) {
    return prevFunctionCall.transpile()+"("+parameters.transpile()+")"
  },
  FunctionArguments_arguments(argument, _comma, otherArguments) {
    return argument.transpile()+", "+otherArguments.transpile()
  },
  FunctionArguments_endArgument(argument) {
    return argument.sourceString
  },
  FunctionArguments_noArgument(_) {
    return "" 
  },
})

export const transpile = (parsedInput: MatchResult) => {
  if(parsedInput.succeeded()){
    const adapter = semantics(parsedInput)
    return adapter.transpile()
  } else {
    console.error("Failed to parse", parsedInput.message);
    return undefined;
  }
}