import { Variable } from '../types';

export const getCheckContextDefaultVariables = (): Variable[] => [
  {
    hasValue: true,
    name: '@jsFunction',
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
