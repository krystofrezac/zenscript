export type Type = {
    hasValue: boolean
  } & (
    {
      type: "string" | "number";
    } 
    | {
      type: "function",
      parameters: {
        name: string,
        type: Type
      }[]
      returns: Type
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