export enum TypeTreeCheckerErrorName {
  IdentifierAlreadyDeclaredInThisScope = 'IdentifierAlreadyDeclaredInThisScope',
  UnknownIdentifier = 'UnknownIdentifier',
}
type TypeTreeCheckerErrorBase<
  TName extends TypeTreeCheckerErrorName,
  TData extends Record<string, unknown>,
> = {
  name: TName;
  data: TData;
};
export type TypeTreeCheckerError =
  | TypeTreeCheckerErrorBase<
      TypeTreeCheckerErrorName.UnknownIdentifier,
      { identifier: string }
    >
  | TypeTreeCheckerErrorBase<
      TypeTreeCheckerErrorName.IdentifierAlreadyDeclaredInThisScope,
      { identifier: string }
    >;
