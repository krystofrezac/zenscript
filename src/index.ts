import { check } from './checker';
import { createCheckerContext } from './checker/checkerContext';
import { parse } from './parser';
import { createSemantics } from './semantics';
import { transpile } from './transpiler';

// TODO: these don't work
// add: (number, number) number = @jsValue("add")
// callFunctionWithCommonArguments = (fun) {
//   a: string = fun(1)
//   a
// }
// funToCall = (a) add(1, a)
// result = callFunctionWithCommonArguments(funToCall)

// callFunctionWithCommonArguments: ((number) 'a) 'a = (fun) fun(1)

// myFun: ('a, 'a) number = @jsValue("")
// a: (number) number = (param) myFun(1, param)

// TODO: this works but prints wrong error
// conditionalCall = (funToCall) @if(true, funToCall(), 0)
// fun = () true
// result = conditionalCall(fun)

// myFun: ('a, 'a) number = @jsValue("")
// a = (param) myFun(1, param)
// c = a(true)

const code = `
  myFun: ('a, 'b) 'b = @jsValue("")
  myFuna: ('a, 'b) 'a = @jsValue("")
  b = myFun(2, 1)
  c = myFuna(2, "")
  d = (a)myFun(1, a)
  e = d("")
`;

const run = () => {
  const checkerContext = createCheckerContext();

  const semantics = createSemantics(checkerContext);

  const parsed = parse(code);
  if (parsed.failed()) {
    console.log('Parsing failed!');
    return;
  }
  const adapter = semantics(parsed);
  const checked = check(adapter, checkerContext);
  if (checked) {
    console.log(transpile(adapter));
  }
};
run();
