import { Type } from "../types"

export const areTypeCompatible = (base: Type, compare: Type):boolean=>{
  if(compare.type==="unknown") return true
  if(base.type==="string" && compare.type==="string") return true
  if(base.type==="number" && compare.type==="number") return true
  if(base.type==="tuple" && compare.type==="tuple"){
    if(base.items.length!==compare.items.length) return false

    return base.items.every((baseItem, index)=>{
      const compareItem = compare.items[index]
      if(!compareItem) return false;
      return areTypeCompatible(baseItem, compareItem)
    })
  }

  return false
}