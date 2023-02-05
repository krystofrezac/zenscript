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
    describe('function parameters', () => {
      test('valid direct return inference', () => {
        const code = `
        add: (number) number = @jsValue("add")
        myFun: (number) number = (a) add(a)
      `;
        expect(checkCode(code)).toBe(true);
      });
      test('invalid direct return inference', () => {
        const code = `
        add: (number) number = @jsValue("add")
        myFun: (string) number = (a) add(a)
      `;
        expect(checkCode(code)).toBe(false);
      });
      test('valid block return inference', () => {
        const code = `
        add: (number) number = @jsValue("add")
        myFun: (number) number = (a) {
          b = a 
          c = add(b)
          c
        }
      `;
        expect(checkCode(code)).toBe(true);
      });
      test('invalid direct return inference', () => {
        const code = `
        add: (number) number = @jsValue("add")
        myFun: (string) number = (a) {
          b = a 
          c = add(b)
          c
        }
      `;
        expect(checkCode(code)).toBe(false);
      });
    });
  });

  describe('assigning only expressions with values', () => {
    test('assigning number', () => {
      const code = `
        a = 2
      `;
      expect(checkCode(code)).toBe(true);
    });
    test('assigning string', () => {
      const code = `
        a = ""
      `;
      expect(checkCode(code)).toBe(true);
    });
    test('assigning block', () => {
      const code = `
        a = {
          1
        }
      `;
      expect(checkCode(code)).toBe(true);
    });
    test('assigning function', () => {
      const code = `
        a = ()1
        b = (a, b)b
      `;
      expect(checkCode(code)).toBe(true);
    });
    describe('assigning variable', () => {
      test('with value', () => {
        const code = `
          a = 1
          b = a
      `;
        expect(checkCode(code)).toBe(true);
      });
      test('without value', () => {
        const code = `
          a: number
          b = a
      `;
        expect(checkCode(code)).toBe(false);
      });
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
