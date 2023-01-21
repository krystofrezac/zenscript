import { NonterminalNode } from 'ohm-js'
import grammar from './grammar.ohm-bundle'
import { parse } from './parser'

const semantics = grammar.createSemantics()

const transpileRawFunctionCall = (parameters: NonterminalNode)=>{
  const transpiledParameters = parameters.transpile()
  return "eval(" + transpiledParameters + ")"
}

const transpileStrJoinFunctionCall = (parameters: NonterminalNode)=>{
  const transpiledParameters = parameters.transpile() as string
  return transpiledParameters.split(", ").join(" + ")
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
  Program_wrappedInEmptyLines(_startEmptyLines, program, _endEmptyLines){
    return program.transpile()
  },
  Statement(statement){
    return statement.transpile()+"\n"
  },
  VariableDeclaration(identifier, _valueAssignmentOperator, expression){
    return `const ${identifier.sourceString} = ${expression.transpile()}`
  },
  identifier(identifier){
    return identifier.sourceString
  },
  number(number){
    return number.sourceString
  },
  string(_startQuotes, value, _endQuotes) {
    return '"' + value.sourceString + '"'
  },
  Block(_startCurlyBraces, _startEmptyLines, blockStatements, _endCurlyBraces) {
    return "(()=>{\n"+blockStatements.transpile()+"\n})()"
  },
  BlockStatement_statements(statement, _emptyLines, blockStatement){
    return statement.transpile()+blockStatement.transpile()
  },
  BlockStatement_endStatement(expression, _emptyLines){
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
  FunctionCall(identifier, _startBracket, parameters, _endBracket) {
    const transpiledIdentifier = identifier.transpile()
    if(transpiledIdentifier === "raw!")
      return transpileRawFunctionCall(parameters)
    if(transpiledIdentifier === "strJoin!")
      return transpileStrJoinFunctionCall(parameters)

    return transpiledIdentifier+"("+parameters.transpile()+")"
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

const transpile = (input: string)=>{
  const parsed = parse(input)
  if(parsed.succeeded()){
    console.log("Parsed successfully\n");
    const adapter = semantics(parsed)
    console.log((adapter.transpile() as string).split("\n").map(line=>"  "+line).join("\n"))
  } else {
    console.error("Failed to parse", parsed.message);
  }
}


transpile(`
  hof = (a)(b){
    b
  }
  a = hof(1)
  b = a(2)
`)
