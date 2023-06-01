import type { AstNodeName } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import { AstCheckerTypeName } from '../types/types';
import { checkAstNodes } from './helpers/checkAstNodes';
import { checkAtomTypeNode } from './atom';

export const checkAtomUnionNode: CheckAstNode<AstNodeName.AtomUnionType> = (
  context,
  atomUnion,
) => {
  const { context: atomsContext, nodeTypes: checkedAtoms } = checkAstNodes(
    context,
    atomUnion.atoms,
    checkAtomTypeNode,
  );

  return getCheckNodeReturn(atomsContext, {
    name: AstCheckerTypeName.AtomUnion,
    atoms: checkedAtoms,
    hasValue: false,
  });
};
