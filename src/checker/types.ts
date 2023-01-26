export type Type = {
    hasValue: boolean
  } & (
    {
      type: "string" | "number";
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