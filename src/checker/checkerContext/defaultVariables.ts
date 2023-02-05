import { Variable } from '../types';

export const getCheckContextDefaultVariables = (): Variable[] => [
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
          { type: 'generic', name: 'a', index: 0 },
          { type: 'generic', name: 'a', index: 0 },
        ],
      },
      returns: { type: 'generic', name: 'a', index: 0 },
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
