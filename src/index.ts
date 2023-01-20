import grammar, { BoringLangSemantics } from './grammar.ohm-bundle'

const s: BoringLangSemantics  = grammar.createSemantics()
s.addOperation("transpile", {
  _iter(...children) {
    return children.map(c => c.transpile());
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
    return identifier.sourceString;
  },
  number(number){
    return number.sourceString;
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
  FunctionDeclaration(_startBracket, parameters, _endBracket, _startCurlyBrace, _startEmptyLines, functionBody, _endCurlyBrace) {
    return "("+parameters.transpile()+")=>{\n"+functionBody.transpile()+"\n}"
  },
  FunctionBody_statements(statement, _emptyLines, functionBody) {
    return statement.transpile()+functionBody.transpile() 
  },
  FunctionBody_endStatement(expression, _emptyLines) {
    return "return "+ expression.transpile() 
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
  FunctionCall(identifier, _startBracket, params, _endBracket) {
    return identifier.transpile()+"("+params.transpile()+")"
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

const parse = (input: string)=>{
  const m = grammar.match(input);
  if(m.succeeded()){
    console.log("Parsed successfully\n");
    const adapter = s(m)
    console.log((adapter.transpile() as string).split("\n").map(line=>"  "+line).join("\n"))
  } else {
    console.error("Failed to parse", m.message);
  }
}


parse(`
  myNum = 1
  a = (num){
    c = num
    c
  }
  a(myNum)
`)

