import { check } from './checker';
import { createCheckerContext } from './checker/checkerContext';
import { parse } from './parser';
import { createSemantics } from './semantics';
import { transpile } from './transpiler';

const code = `
  // add: (number) number = @jsValue("add")
  a: ('a, 'b) 'a = (b, c) b
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
