import type { AstCheckerType } from '../../types/types';
import { AstCheckerTypeNames } from '../../types/types';

export const emptyAstCheckerNode: AstCheckerType = {
  name: AstCheckerTypeNames.Empty,
  hasValue: false,
};
