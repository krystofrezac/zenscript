import ohm from 'ohm-js';
import { findVariableFromCurrentScope } from '../checker/checkerContext';
import { CheckerContext } from '../checker/types';
import { BoringLangSemantics } from '../grammar.ohm-bundle';

type CreateHasValueOperationOptions = {
  checkerContext: CheckerContext;
};

export const createHasValueOperation = (
  semantics: BoringLangSemantics,
  { checkerContext: context }: CreateHasValueOperationOptions,
) =>
  semantics.addOperation<ReturnType<ohm.Node['getHasValue']>>('getHasValue', {
    _iter: (...children) =>
      children.every(ch => {
        console.log(ch.sourceString);
        return ch.getHasValue();
      }),
    NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) =>
      firstItem.getHasValue() && tailIterable.getHasValue(),
    EmptyListOf: () => true,
    identifier: identifier => {
      const variable = findVariableFromCurrentScope(
        context,
        identifier.sourceString,
      );
      if (!variable) return false;
      return variable.hasValue;
    },
    VariableDeclaration_onlyType: (_identifier, _typeAssignment) => false,
    VariableDeclaration_onlyValue: (_identifier, _valueAssignment) => true,
    VariableDeclaration_valueAndType: (
      _identifier,
      _typeAssignment,
      _valueAssignment,
    ) => true,
    ValueAssignment: (_assignmentOperator, expression) =>
      expression.getHasValue(),
    stringExpression: (_startQuotes, _content, _endQuotes) => true,
    numberExpression: _number => true,
    FunctionCall_firstCallCompilerHook: (
      hookName,
      _startBracket,
      _arguments,
      _endBracket,
    ) => hookName.sourceString === '@jsFunction',
    FunctionCall_firstCall: (
      identifier,
      _startBracket,
      _arguments,
      _endBracket,
    ) => {
      const functionDeclaration = findVariableFromCurrentScope(
        context,
        identifier.sourceString,
      );
      if (!functionDeclaration) return false;
      return functionDeclaration.hasValue;
    },
  });
