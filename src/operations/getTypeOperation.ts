import ohm, { NonterminalNode } from 'ohm-js';
import {
  findVariableFromCurrentScope,
  addError,
  pushTypeScope,
  popTypeScope,
  addVariableToCurrentScope,
} from '../checker/checkerContext';
import { areTypesCompatible } from '../checker/helpers/areTypesCompatible';
import { createType } from '../checker/helpers/createType';
import { tryToFigureOutType } from '../checker/helpers/figureOutType';
import { CheckerContext } from '../checker/types';
import { BoringLangSemantics } from '../grammar.ohm-bundle';

type CreateGetTypeOperationOptions = {
  checkerContext: CheckerContext;
};

export const createGetTypeOperation = (
  semantics: BoringLangSemantics,
  { checkerContext: context }: CreateGetTypeOperationOptions,
) => {
  const checkFirstFunctionCall = (
    identifier: NonterminalNode,
    parameters: NonterminalNode,
  ) => {
    const functionType = identifier.getType();
    const parametersType = parameters.getType();

    if (functionType.type !== 'function') {
      addError(context, {
        message: `Variable '${identifier.sourceString}' is not callable`,
      });
      return createType({ type: 'unknown' });
    }

    if (!parameters.getHasValue()) {
      addError(context, { message: `Some parameters don't have value` });
      return createType({ type: 'unknown' });
    }

    tryToFigureOutType(functionType.parameters, parametersType);
    if (!areTypesCompatible(functionType.parameters, parametersType)) {
      addError(context, {
        message:
          `You are calling function ${identifier.sourceString} with wrong arguments` +
          `\n${JSON.stringify(functionType.parameters)}` +
          `\n${JSON.stringify(parametersType)}`,
      });
      return createType({ type: 'unknown' });
    }

    return createType(functionType.returns);
  };
  const getIdentifierType = (identifierName: string) => {
    const referencedVariable = findVariableFromCurrentScope(
      context,
      identifierName,
    );

    if (!referencedVariable) {
      addError(context, {
        message: `Variable with name '${identifierName}' could not be found`,
      });
      return createType({ type: 'unknown' });
    }

    return referencedVariable?.type;
  };

  semantics.addOperation<ReturnType<ohm.Node['getType']>>('getType', {
    NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) =>
      createType({
        type: 'tuple',
        items: [firstItem.getType(), ...tailIterable.getTypes()],
      }),
    EmptyListOf: () =>
      createType({
        type: 'tuple',
        items: [],
      }),
    stringExpression: (_startQuotes, _string, _endQuotes) =>
      createType({
        type: 'string',
      }),
    numberExpression: _number =>
      createType({
        type: 'number',
      }),
    identifier: identifier => getIdentifierType(identifier.sourceString),
    compilerHook: (_at, compilerHook) =>
      getIdentifierType('@' + compilerHook.sourceString),
    ValueAssignment: (_equals, expression) => expression.getType(),
    TypeAssignment: (_colon, type) => type.getType(),
    numberType: _ =>
      createType({
        type: 'number',
      }),
    stringType: _ =>
      createType({
        type: 'string',
      }),
    Block: (_startCurly, statements, _endCurly) => {
      pushTypeScope(context);
      const types = statements.getTypes();
      popTypeScope(context);
      const lastStatementType = types[types.length - 1];
      if (!lastStatementType) return createType({ type: 'unknown' });

      return lastStatementType;
    },
    BlockStatement_statements: (statement, _emptyLines, otherStatements) => {
      statement.checkType();
      return otherStatements.getType();
    },
    BlockStatement_endStatement: expression => expression.getType(),
    FunctionDeclaration: (
      _startBrace,
      parameters,
      _nedBrace,
      returnExpression,
    ) => {
      pushTypeScope(context);
      const parametersType = parameters.getType();
      const returnType = returnExpression.getType();
      popTypeScope(context);

      return createType({
        type: 'function',
        parameters: parametersType,
        returns: returnType,
      });
    },
    FunctionParameter: parameter => {
      const parameterName = parameter.sourceString;
      const defaultType = createType({ type: 'figureOut' });
      addVariableToCurrentScope(context, {
        name: parameterName,
        type: defaultType,
        hasValue: true,
      });
      return defaultType;
    },
    FunctionCall_firstCallCompilerHook: (
      compilerHook,
      _startBrace,
      parameters,
      _endBrace,
    ) => {
      checkFirstFunctionCall(compilerHook, parameters);
      return createType({ type: 'unknown' });
    },
    FunctionCall_firstCall: (identifier, _startBrace, parameters, _endBrace) =>
      checkFirstFunctionCall(identifier, parameters),
  });
};
