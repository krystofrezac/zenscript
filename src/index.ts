import { readFile } from 'fs/promises';
import { join } from 'path';
import { getTypeAST } from './typeAST';
import { parse } from './parser';
import { checkAST } from './astChecker';

const run = async () => {
  const code = await readFile(join(__dirname, '../input'), 'utf-8');
  const parsed = parse(code);
  if (parsed.failed()) {
    console.log('Parsing failed!');
    return;
  }
  const typeAST = getTypeAST(parsed);
  const checkResult = checkAST(typeAST);

  console.log(JSON.stringify(checkResult, undefined, 2));
};
run();
