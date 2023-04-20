import { readFile } from 'fs/promises';
import { join } from 'path';
import { getAst } from './ast';
import { parse } from './parser';

const run = async () => {
  const code = await readFile(join(__dirname, '../input'), 'utf-8');
  const parsed = parse(code);
  if (parsed.failed()) {
    console.log('Parsing failed!');
    return;
  }
  const ast = getAst(parsed);
  // const checkResult = checkAst(ast);

  console.log(JSON.stringify(ast, undefined, 2));
};
run();
