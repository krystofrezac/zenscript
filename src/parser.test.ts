import {describe, expect, test} from 'vitest'
import { parse } from './parser'

describe("parser", ()=>{
  describe("variable declaration", ()=>{
    test("assigning number", ()=>{
      const input = `
        a = 1  
      `
      expect(parse(input).succeeded()).toBe(true)
    })

    test("assigning string", ()=>{
      const input = `
        a = "abc"  
      `
      expect(parse(input).succeeded()).toBe(true)
    })

    test("multiple assignments", ()=>{
      const input = `
        a = "abc"
        b = 123
        c = 88
      `
      expect(parse(input).succeeded()).toBe(true)
    })

    test("with type", ()=>{
      const input = `
        a: string = "abc"
        b: number = 123
        c: b = 88
      `
      expect(parse(input).succeeded()).toBe(true)
    })
  })

  describe("block", ()=>{
    test("one line block", ()=>{
      const input = `
        a = {
          1
        }
      `
      expect(parse(input).succeeded()).toBe(true)
    })
    test("multi line block", ()=>{
      const input = `
        a = {
          b = 1
          c = b
          c
        }
      `
      expect(parse(input).succeeded()).toBe(true)
    })
    test("with type", ()=>{
      const input = `
        a: number = {
          b = 1
          b
        } 
      `
      expect(parse(input).succeeded()).toBe(true)
    })
  })

  describe("functions", ()=>{
    describe("function declaration", ()=>{
      test("no parametr & number return", ()=>{
        const input = `
          myFun = ()1
        `
        expect(parse(input).succeeded()).toBe(true)
      })
      test("no parametr & string return", ()=>{
        const input = `
          myFun = ()"hello"
        `
        expect(parse(input).succeeded()).toBe(true)
      })
      test("no parametr & block return", ()=>{
        const input = `
          myFun = (){
            a = 1
            a
          }
        `
        expect(parse(input).succeeded()).toBe(true)
      })
      test("one parametr", ()=>{
        const input = `
          myFun = (param)param
        `
        expect(parse(input).succeeded()).toBe(true)
      }) 
      test("two parameters", ()=>{
        const input = `
          myFun = (paramA, paramB) paramA
        `
        expect(parse(input).succeeded()).toBe(true)
      }) 
      test("return function call", ()=>{
        const input = `
          myFun = (paramA, paramB) paramB(paramA)
        `
        expect(parse(input).succeeded()).toBe(true)
      })
      test("higher order function & simple return", ()=>{
        const input = `
          myFun = (paramA)(paramB)paramA
        `
        expect(parse(input).succeeded()).toBe(true)
      }) 
      test("higher order function & block return", ()=>{
        const input = `
          myFun = (paramA)(paramB){
            a = paramA
            a
          }
        `
        expect(parse(input).succeeded()).toBe(true)
      }) 
      test("with type", ()=>{
        const input = `
          funA: (number)number = (paramA){
            a = paramA
            a
          }
          funB: (number, string)number = (paramA, paramB){
            a = paramA
            a
          }
          funC: (number, ()number)number = (paramA, paramB)paramB()
        `
        expect(parse(input).succeeded()).toBe(true)
      })
    })
    describe("function call", ()=>{
      test("one argument", ()=>{
        const input = `
          myFun(1) 
        `
        expect(parse(input).succeeded()).toBe(true)
      })
      test("two argument", ()=>{
        const input = `
          myFun(1, "hello")
        `
        expect(parse(input).succeeded()).toBe(true)
      })
      test("multiple chained calls", ()=>{
        const input = `
          myFun("a")(a())(1)()
        `
        expect(parse(input).succeeded()).toBe(true)
      })
    })
  })
})