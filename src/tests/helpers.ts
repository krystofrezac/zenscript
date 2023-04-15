import { getTypeAST } from '../typeAST';
import { parse } from '../parser';

export const codeToAST = (code: string) => {
  const parsed = parse(code);

  return getTypeAST(parsed);
};
