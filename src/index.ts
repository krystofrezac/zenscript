import { getApproximateTypeAST } from './checker/approximateTypeAST'
import { parse } from './parser'

const code = `
  a: string = {
    b: number = 1
    c = b
    c
  }
`

const parsed = parse(code)
console.log(JSON.stringify(getApproximateTypeAST(parsed), undefined, 2))
