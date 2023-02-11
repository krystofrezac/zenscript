import ohm, { NonterminalNode } from 'ohm-js';
import {
  findVariableFromCurrentScope,
  addError,
  pushTypeScope,
  popTypeScope,
} from '../checker/checkerContext';
import { areTypesCompatible } from '../checker/helpers/areTypesCompatible';
import { createType } from '../checker/helpers/createType';
import {
  getDefaultTypeWhenFigureOut,
  tryToFigureOutType,
} from '../checker/helpers/figureOutType';
import { getFunctionTypeParametersType } from '../checker/helpers/getFunctionTypeParametersType';
import { getFunctionTypeReturnType } from '../checker/helpers/getFunctionTypeReturnType';
import { getFunctionValueParametersType } from '../checker/helpers/getFunctionValueParametersType';
import { getSpecificReturn } from '../checker/helpers/getSpecificReturn';
import { typeToString } from '../checker/helpers/typeToString';
import { CheckerContext } from '../checker/types';
import { BoringLangSemantics } from '../grammar.ohm-bundle';

type CreateGetTypeOperationOptions = {
  checkerContext: CheckerContext;
};

export const createGetTypeOperation = (
  semantics: BoringLangSemantics,
  { checkerContext: context }: CreateGetTypeOperationOptions,
) => {
  const getFirstFunctionCallType = (
    identifier: NonterminalNode,
    calledWithParameters: NonterminalNode,
  ) => {
    const functionType = identifier.getType();
    const calledWithParametersType = calledWithParameters.getType();
    if (calledWithParametersType.type !== 'tuple')
      return createType({ type: 'unknown' });

    if (functionType.type === 'figureOut') {
      tryToFigureOutType(
        createType({
          type: 'function',
          parameters: calledWithParametersType,
          returns: createType({
            type: 'figureOut',
            defaultType: createType({
              type: 'generic',
              id: -1,
            }),
          }),
        }),
        functionType,
      );
    }

    if (functionType.type !== 'function') {
      addError(context, {
        message: `Variable '${identifier.sourceString}' is not callable`,
      });
      return createType({ type: 'unknown' });
    }

    if (!calledWithParameters.getHasValue()) {
      addError(context, { message: `Some parameters don't have value` });
      return createType({ type: 'unknown' });
    }

    // figure arguments based on parameters
    tryToFigureOutType(functionType.parameters, calledWithParametersType);
    if (
      !areTypesCompatible(functionType.parameters, calledWithParametersType)
    ) {
      addError(context, {
        message:
          `You are calling function ${identifier.sourceString} with wrong arguments` +
          `\nexpected: ${typeToString(functionType.parameters)}` +
          `\nactual: ${typeToString(calledWithParametersType)}`,
      });
      return createType({ type: 'unknown' });
    }

    functionType.returns = getDefaultTypeWhenFigureOut(functionType.returns);
    return getSpecificReturn(functionType, calledWithParametersType);
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
    booleanExpression: _value =>
      createType({
        type: 'boolean',
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
    booleanType: _value =>
      createType({
        type: 'boolean',
      }),
    genericName: (_apostrophe, name) =>
      createType({ type: 'namedGeneric', id: -1, name: name.sourceString }),
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
    FunctionValueDeclaration: (
      _startBrace,
      parameters,
      _endBrace,
      returnExpression,
    ) => {
      pushTypeScope(context);
      const figureOutParametersType = getFunctionValueParametersType(
        context,
        parameters,
      );
      const returnType = returnExpression.getType();
      popTypeScope(context);

      if (figureOutParametersType.type !== 'tuple')
        return createType({ type: 'unknown' });

      // TODO: if it still 'figureOut' than it's unused and probably should cause error
      const parametersItemsType = figureOutParametersType.items.map(
        getDefaultTypeWhenFigureOut,
      );

      return createType({
        type: 'function',
        parameters: createType({ type: 'tuple', items: parametersItemsType }),
        returns: getDefaultTypeWhenFigureOut(returnType),
      });
    },
    FunctionTypeDeclaration: (
      _startBrace,
      parameters,
      _endBrace,
      returnExpression,
    ) => {
      const parametersType = getFunctionTypeParametersType(context, parameters);
      const returnType = getFunctionTypeReturnType(context, {
        parametersType,
        returnExpression,
      });

      return createType({
        type: 'function',
        parameters: parametersType,
        returns: returnType,
      });
    },
    FunctionCall_firstCallCompilerHook: (
      compilerHook,
      _startBrace,
      parameters,
      _endBrace,
    ) => getFirstFunctionCallType(compilerHook, parameters),
    FunctionCall_firstCall: (identifier, _startBrace, parameters, _endBrace) =>
      getFirstFunctionCallType(identifier, parameters),
  });
};
