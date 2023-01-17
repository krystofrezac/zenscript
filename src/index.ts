import fs from 'fs';
import ohm from 'ohm-js';

const contents = fs.readFileSync('grammar.ohm', 'utf-8');

const myGrammar = ohm.grammar(contents);

const s = myGrammar.createSemantics()
s.addOperation("transpile", {
  _iter(...children) {
    return children.map(c => c.transpile());
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
    return "(()=>{"+blockStatements.transpile()+"})()"
  },
  BlockStatement_statements(statement, _emptyLines, blockStatement){
    return statement.transpile()+blockStatement.transpile()
  },
  BlockStatement_endStatement(expression, _emptyLines){
    return "return "+expression.transpile()
  }
})

const parse = (input: string)=>{
  const m = myGrammar.match(input);
  if(m.succeeded()){
    console.log("Parsed successfully");
    const adapter = s(m)
    console.log(adapter.transpile())
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

`)

