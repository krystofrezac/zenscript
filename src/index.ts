import { check } from './checker'
import { parse } from './parser'

const code = `
  add = (a)(b) {
    a
  }
  add(1, 2)
`

const parsed = parse(code)
console.log(JSON.stringify(check(parsed), undefined, 2))
