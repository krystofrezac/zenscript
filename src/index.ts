import fs from 'fs';
import ohm from 'ohm-js';

const contents = fs.readFileSync('grammar.ohm', 'utf-8');

const myGrammar = ohm.grammar(contents);

const s = myGrammar.createSemantics()
s.addOperation("eval", {
  AddExp_plus(a, _, b){
    return a.eval() + b.eval()
  },
  AddExp_minus(a, _, b){
    return a.eval() - b.eval()
  },
  MulExp_times(a, _, b) {
    return a.eval() * b.eval();
  },
  MulExp_div(a, _, b) {
    return a.eval() / b.eval();
  },
  number(_){
    return parseInt(this.sourceString)
  }
})

const parse = (input: string)=>{
  const m = myGrammar.match(input);
  if(m.succeeded()){
    console.log("Parsed successfully");
    const adapter = s(m)
    console.log(adapter.prettyPrint())
  } else {
    console.error("Failed to parse", m.message);
  }
}


parse("1+2*3")

