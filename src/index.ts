import { check } from './checker/check'
import { parse } from './parser'

const code = `
  a = 1
  b: string = a
`

const parsed = parse(code)
console.log(JSON.stringify(check(parsed), undefined, 2))
