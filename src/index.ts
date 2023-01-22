import { check } from './checker/test'
import { parse } from './parser'

const code = `
  a = 1
  a = 2
`

const parsed = parse(code)
console.log(JSON.stringify(check(parsed), undefined, 2))
