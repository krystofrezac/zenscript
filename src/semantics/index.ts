import { CheckerContext } from "../checker/types";
import grammar from "../grammar.ohm-bundle";
import { createCheckTypeOperation } from "../operations/checkOperation";
import { createGetTypeOperation } from "../operations/getTypeOperation";
import { createGetTypesOperation } from "../operations/getTypesOperation";
import { createTranspileOperation } from "../operations/transpileOperation";

export const createSemantics = (checkerContext: CheckerContext)=>{ 
  const semantics = grammar.createSemantics()
  createTranspileOperation(semantics)
  createGetTypeOperation(semantics, {checkerContext})
  createGetTypesOperation(semantics)
  createCheckTypeOperation(semantics, {checkerContext})
  return semantics;
}