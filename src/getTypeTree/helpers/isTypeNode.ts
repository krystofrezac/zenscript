import { TypeNode, TypeTreeNode, TypeTreeNodeName } from '../types';

export const isTypeNode = (node: TypeTreeNode): node is TypeNode => {
  // Map so I don't forget to add new TypeNode
  const map: Record<TypeNode['name'], true> = {
    [TypeTreeNodeName.Block]: true,
    [TypeTreeNodeName.String]: true,
    [TypeTreeNodeName.Number]: true,
    [TypeTreeNodeName.Tuple]: true,
    [TypeTreeNodeName.VariableReference]: true,
    [TypeTreeNodeName.FunctionDeclaration]: true,
    [TypeTreeNodeName.FunctionCall]: true,
    [TypeTreeNodeName.Parameter]: true,
    [TypeTreeNodeName.Generic]: true,
  };
  const keys = Object.keys(map) as unknown as TypeTreeNodeName[];
  return keys.includes(node.name);
};
