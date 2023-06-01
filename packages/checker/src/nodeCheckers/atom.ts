import type { AstNodeName } from '@zen-script/ast';
import type { AstNode } from '@zen-script/ast';
import type { CheckAstNode } from '../types';
import { getCheckNodeReturn } from './helpers/getCheckNodeReturn';
import type { AstCheckerAtomType } from '../types/types';
import { AstCheckerTypeName } from '../types/types';
import { checkAstNodes } from './helpers/checkAstNodes';
import { checkAstNode } from '.';

const checkAtomNode =
  (
    hasValue: boolean,
  ): CheckAstNode<
    AstNodeName.AtomExpression | AstNodeName.AtomType,
    AstCheckerAtomType
  > =>
  (context, atom) => {
    const { context: argumentsContext, nodeTypes: checkedArguments } =
      checkAstNodes<AstNode>(context, atom.arguments, checkAstNode);

    return getCheckNodeReturn(argumentsContext, {
      name: AstCheckerTypeName.Atom,
      arguments: checkedArguments,
      atomName: atom.atomName,
      hasValue,
    });
  };

export const checkAtomExpressionNode: CheckAstNode<AstNodeName.AtomExpression> =
  checkAtomNode(true);
export const checkAtomTypeNode: CheckAstNode<
  AstNodeName.AtomType,
  AstCheckerAtomType
> = checkAtomNode(false);
