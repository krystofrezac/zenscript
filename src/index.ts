import { getTypeTree } from './getTypeTree';
import { parse } from './parser';
import { createSemantics } from './semantics';

const code = `  
  a = 1
`;

const run = () => {
  const semantics = createSemantics();

  const parsed = parse(code);
  if (parsed.failed()) {
    console.log('Parsing failed!');
    return;
  }
  const adapter = semantics(parsed);
  const typeTree = getTypeTree(adapter);
  console.log(JSON.stringify(typeTree, undefined, 2));
  // if (checked) {
  //   console.log(transpile(adapter));
  // }
};
run();
