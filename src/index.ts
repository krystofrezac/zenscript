import grammar, { BoringLangSemantics } from './grammar.ohm-bundle'

const s: BoringLangSemantics  = grammar.createSemantics()
s.addOperation("transpile", {
  _iter(...children) {
    return children.map(c => c.transpile());
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
  functionCall(identifier, _params){
    return identifier.transpile()+"()"
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
  FunctionParameters_parametr(parameter, _comma, parameters) {
    return parameter.transpile()+", "+ parameters.transpile()
  },
  FunctionParametr(parametr) {
    return parametr.sourceString 
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
a=2
b=a
c = {
  g = b
  g
}

myFun = (g,j, h){
  l=a
  l
}

myOtherFun = (num){
  myFun()
}

`)

