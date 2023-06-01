import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeName } from '../../types/types';

export const ignoreAstCheckerNode: AstCheckerType = {
  name: AstCheckerTypeName.Ignore,
  hasValue: false,
};
