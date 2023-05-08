import grammar from './grammar.ohm-bundle';

export const parse = (input: string) => {
  const parsedResult = grammar.match(input);
  return parsedResult;
};
