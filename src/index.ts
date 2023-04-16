import { readFile } from 'fs/promises';
import { join } from 'path';
import { getAST } from './ast';
import { parse } from './parser';

const run = async () => {
  const code = await readFile(join(__dirname, '../input'), 'utf-8');
  const parsed = parse(code);
  if (parsed.failed()) {
    console.log('Parsing failed!');
    return;
  }
  const typeAST = getAST(parsed);
  // const checkResult = checkAST(typeAST);

  console.log(JSON.stringify(typeAST, undefined, 2));
};
run();
