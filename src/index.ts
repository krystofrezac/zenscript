import { check } from './checker';
import { createCheckerContext } from './checker/checkerContext';
import { parse } from './parser';
import { createSemantics } from './semantics';
import { transpile } from './transpiler';

const code = `
  add: (number) number = @jsFunction("add")
  myFun: (number) number = (a) {
    b = a
    add(b)
  }
  a = myFun(1)
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
