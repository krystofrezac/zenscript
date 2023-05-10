import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeNames } from '../../types/types';

export const ignoreAstCheckerNode: AstCheckerType = {
  name: AstCheckerTypeNames.Ignore,
  hasValue: false,
};
