import { getTypeTree } from '../../getTypeTree';
import { parse } from '../../parser';
import { createSemantics } from '../../semantics';

const semantics = createSemantics();
export const getInput = (code: string) => {
  const adapter = semantics(parse(code));

  return getTypeTree(adapter);
};
