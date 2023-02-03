import { describe, expect, test } from 'vitest';
import { check } from '.';
import { parse } from '../parser';
import { createSemantics } from '../semantics';
import { createCheckerContext } from './checkerContext';

const checkCode = (input: string) => {
  const checkerContext = createCheckerContext();
  const semantics = createSemantics(checkerContext);
  const adapter = semantics(parse(input));

  return check(adapter, checkerContext);
};

describe('type checking', () => {
  describe('type inference', () => {
    test('string', () => {
      const code = `
        a = "a" 
        b: string = a
      `;
      expect(checkCode(code)).toBe(true);
    });
    test('number', () => {
      const code = `
        a = 1 
        b: number = a
      `;
      expect(checkCode(code)).toBe(true);
    });
    test('block', () => {
      const code = `
        a = {
          c = 1
          c
        } 
        b: number = a
      `;
      expect(checkCode(code)).toBe(true);
    });
    // TODO:
    test.skip('function', () => {
      const code = `
        a = (a, b) 1
        b: (number, number) number = a
      `;
      expect(checkCode(code)).toBe(true);
    });
  });

  describe('variable scoping', () => {
    test('redeclaring in different scope', () => {
      const code = `
        a = 1 
        b = {
          a = 2
          a
        }
      `;
      expect(checkCode(code)).toBe(true);
    });
    test('redeclaring in same scope', () => {
      const code = `
        a = 1 
        a = 2
      `;
      expect(checkCode(code)).toBe(false);
    });
  });
});
