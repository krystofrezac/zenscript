export const pipe = <TValue>(value: TValue) => {
  const to = <TReturn>(fun: (param: TValue) => TReturn) => pipe(fun(value));
  return { to, result: () => value };
};
