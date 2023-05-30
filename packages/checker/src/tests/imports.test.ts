import { expect, test } from 'vitest';
import type { CheckAstResult } from '..';
import { testCheckAst } from './helpers';
import { AstCheckerErrorName } from '../types/errors';

test('import empty file', () => {
  const fileA = `imported: %{} = import("fileB")`;
  const fileB = ``;

  const expected: CheckAstResult = { errors: [], exportedVariables: [] };
  const result = testCheckAst({ entryFile: fileA, files: { fileB } });
  expect(result).toEqual(expected);
});

test('import non empty file', () => {
  const fileA = `imported: %{
    exportedNumber: number,
    exportedString: string,
    exportedRecord: %{
      a: number, 
      b: string
    }
  } = import("fileB")`;
  const fileB = `
    export exportedNumber = 1 
    export exportedString = ""
    export exportedRecord = %{
      a: 1,
      b: "2"
    }
  `;

  const expected: CheckAstResult = { errors: [], exportedVariables: [] };
  const result = testCheckAst({ entryFile: fileA, files: { fileB } });
  expect(result).toEqual(expected);
});

test('import non existing file', () => {
  const fileA = `imported: %{} = import("fileB")`;

  const expected: CheckAstResult = {
    errors: [{ name: AstCheckerErrorName.FileNotFound, data: {} }],
    exportedVariables: [],
  };
  const result = testCheckAst({ entryFile: fileA });
  expect(result).toEqual(expected);
});

test('import with ..', () => {
  const fileA = `imported: %{} = import("../fileB")`;
  const fileB = ``;

  const expected: CheckAstResult = {
    errors: [{ name: AstCheckerErrorName.FileNotFound, data: {} }],
    exportedVariables: [],
  };
  const result = testCheckAst({
    entryFile: fileA,
    entryPathFile: 'a/fileA',
    files: { fileB },
  });
  expect(result).toEqual(expected);
});
