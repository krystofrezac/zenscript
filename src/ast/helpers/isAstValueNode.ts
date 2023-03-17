import { AstValueNode, AstNode, AstNodeName } from '../types';

export const isAstValueNode = (node: AstNode): node is AstValueNode => {
  // Map so I don't forget to add new ValueNode
  const map: Record<AstValueNode['name'], true> = {
    [AstNodeName.Block]: true,
    [AstNodeName.String]: true,
    [AstNodeName.Number]: true,
    [AstNodeName.Tuple]: true,
    [AstNodeName.VariableReference]: true,
    [AstNodeName.FunctionDeclaration]: true,
    [AstNodeName.FunctionCall]: true,
    [AstNodeName.Parameter]: true,
    [AstNodeName.Generic]: true,
  };
  const keys = Object.keys(map) as unknown as AstNodeName[];
  return keys.includes(node.name);
};
