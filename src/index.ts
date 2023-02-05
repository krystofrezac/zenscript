import { check } from './checker';
import { createCheckerContext } from './checker/checkerContext';
import { parse } from './parser';
import { createSemantics } from './semantics';
import { transpile } from './transpiler';

const code = `
  a = true
  b: number = @if(a, 1, 2) 
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
