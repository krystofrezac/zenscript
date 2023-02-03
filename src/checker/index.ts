import { Dict } from 'ohm-js';
import { CheckerContext } from './types';

export const check = (adapter: Dict, checkerContext: CheckerContext) => {
  adapter.checkType();
  console.log(JSON.stringify(checkerContext.typeScopes, undefined, 2));
  console.log(checkerContext.errors);
  return checkerContext.errors.length === 0;
};
