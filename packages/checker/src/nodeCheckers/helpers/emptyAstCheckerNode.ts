import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeName } from '../../types/types';

export const emptyAstCheckerNode: AstCheckerType = {
  name: AstCheckerTypeName.Empty,
  hasValue: false,
};
