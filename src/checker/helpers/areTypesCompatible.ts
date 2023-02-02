import { Type } from "../types"

export const areTypeCompatible = (base: Type, compare: Type)=>{
  if(compare.type==="unknown") return true
  if(base.type==="string" && compare.type==="string") return true
  if(base.type==="number" && compare.type==="number") return true

  return false
}