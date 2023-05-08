export const pipe =
  <TFirstParams extends any[], TFirstReturn>(
    firstFun: (...params: TFirstParams) => TFirstReturn,
    ...otherFunctions: ((param: TFirstReturn) => TFirstReturn)[]
  ) =>
  (...params: TFirstParams): TFirstReturn =>
    otherFunctions.reduce(
      (result, currentFunction) => currentFunction(result),
      firstFun(...params),
    );
