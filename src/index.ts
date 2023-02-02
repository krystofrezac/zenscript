import { check } from './checker/check'
import { parse } from './parser'
import { transpile } from './transpiler'

const code = `
  a: (string, number)number = @jsFunction("myFun")
`

const parsed = parse(code)
const checked = check(parsed)
// if(checked){
//   console.log(transpile(parsed))
// }
