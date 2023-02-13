import { expect } from 'vitest';
import { parse } from '../parser';
import { transpile } from '.';
import { describe, test } from 'vitest';
import { createSemantics } from '../semantics';

const semantics = createSemantics();

const toCode = (input: string) => {
  const adapter = semantics(parse(input));
  return transpile(adapter);
};

describe.skip('transpile', () => {
  test('variable assignment', () => {
    const input = `
      a = 1
      b = "a"
      c = {
        a = 1
        a
      }
      d = true
    `;
    expect(toCode(input)).toMatchInlineSnapshot(`
      "const a = 1
      const b = \\"a\\"
      const c = (()=>{
      const a = 1
      return a
      })()
      const d = true
      "
    `);
  });

  test('function declaration', () => {
    const input = `
      a = ()"return"
      b = (paramA)paramA
      c = (paramA, paramB)paramB
      d = (paramA, paramB){
        a = paramB
        a
      }
      e = (paramA)(paramB)(paramC)paramC
    `;
    expect(toCode(input)).toMatchInlineSnapshot(`
      "const a = ()=>\\"return\\"
      const b = (paramA)=>paramA
      const c = (paramA, paramB)=>paramB
      const d = (paramA, paramB)=>(()=>{
      const a = paramB
      return a
      })()
      const e = (paramA)=>(paramB)=>(paramC)=>paramC
      "
    `);
  });

  test('function call', () => {
    const input = `
      a = a()
      b = b(1,2)
      c = b("a",2)
      d = d(1)()("a")
    `;
    expect(toCode(input)).toMatchInlineSnapshot(`
      "const a = a()
      const b = b(1, 2)
      const c = b(\\"a\\", 2)
      const d = d(1)()(\\"a\\")
      "
    `);
  });
});
