import { getAST } from '../../ast';
import { parse } from '../../parser';

export const codeToAST = (code: string) => {
  const parsed = parse(code);

  return getAST(parsed);
};
