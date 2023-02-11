import { Variable } from '../types';

type GetCheckContextDefaultVariablesReturn = {
  genericIdCounter: number;
  defaultVariables: Variable[];
};

export const getCheckContextDefaultVariables = (
  genericIdCounterParam: number,
): GetCheckContextDefaultVariablesReturn => {
  let genericIdCounter = genericIdCounterParam;
  const defaultVariables: Variable[] = [
    {
      hasValue: true,
      name: '@if',
      type: {
        type: 'function',
        parameters: {
          type: 'tuple',
          items: [
            {
              type: 'boolean',
            },
            { type: 'generic', id: genericIdCounter },
            { type: 'generic', id: genericIdCounter++ },
          ],
        },
        returns: { type: 'generic', id: 0 },
      },
    },
    {
      hasValue: true,
      name: '@jsValue',
      type: {
        type: 'function',
        parameters: {
          type: 'tuple',
          items: [
            {
              type: 'string',
            },
          ],
        },
        returns: {
          type: 'unknown',
        },
      },
    },
  ];
  return { defaultVariables, genericIdCounter };
};
