import { parse } from './parser'
import { transpile } from './transpiler'

const code = `
  hof = (a)(b){
    add = jsExternal!("(j,k)=>j+k")
    add(a, b)
  }
  a = hof(1)(2)
`

const parsed = parse(code)
console.log(transpile(parsed))
