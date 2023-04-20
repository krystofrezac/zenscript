import { getAst } from '../ast';
import { parse } from '../parser';

export const codeToAst = (code: string) => {
  const parsed = parse(code);

  return getAst(parsed);
};
