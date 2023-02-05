import { Type } from './checker/types';

declare module 'ohm-js' {
  interface Node {
    getType: () => Type;
    getTypes: () => Type[];
    checkType: () => void;
    getHasValue: () => boolean;
    getName: () => string;
    transpile: () => string;
  }
}
