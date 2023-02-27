import { readFile } from 'fs/promises';
import { join } from 'path';
import { getTypeTree } from './getTypeTree';
import { parse } from './parser';
import { createSemantics } from './semantics';
import { checkTypeTree } from './typeTreeChecker';

const run = async () => {
  const semantics = createSemantics();

  const code = await readFile(join(__dirname, '../input'), 'utf-8');
  const parsed = parse(code);
  if (parsed.failed()) {
    console.log('Parsing failed!');
    return;
  }
  const adapter = semantics(parsed);
  const typeTree = getTypeTree(adapter);
  const checkResult = checkTypeTree(typeTree);
  console.log(JSON.stringify(checkResult, undefined, 2));
};
run();
