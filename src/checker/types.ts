export type Type = {
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
export type TypeScope = {
  variables: {
    name: string, 
    type: Type
  }[]
}
export type Error = {
  message: string
}