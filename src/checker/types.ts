export type Type = {
    hasValue: boolean
  } & (
    {
      type: "string" | "number" | "unknown";
    } | {
      type: "function", 
      parameters: Type,
      returns: Type
    } | {
      type: "tuple", 
      items: Type[]
    }
  )
export type Variable = {
  name: string, 
  type: Type
}
export type TypeScope = {
  variables: Variable[]
}
export type Error = {
  message: string
}