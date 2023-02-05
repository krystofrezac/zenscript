import ohm, { NonterminalNode } from 'ohm-js';
import {
  findVariableFromCurrentScope,
  addError,
  pushTypeScope,
  popTypeScope,
  addVariableToCurrentScope,
  findVariableInCurrentScope,
} from '../checker/checkerContext';
import { areTypesCompatible } from '../checker/helpers/areTypesCompatible';
import { createType } from '../checker/helpers/createType';
import {
  getDefaultTypeWhenFigureOut,
  tryToFigureOutType,
} from '../checker/helpers/figureOutType';
import { getSpecificReturn } from '../checker/helpers/getSpecificReturn';
import { CheckerContext, GenericType, Type } from '../checker/types';
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

    return getSpecificReturn(functionType, parametersType);
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
  const getFunctionValueParametersType = (parameters: NonterminalNode) => {
    const parametersTypes = parameters
      .asIteration()
      .children.map((parameter, index) => {
        const parameterName = parameter.getName();
        const defaultType = createType({
          type: 'figureOut',
          defaultType: createType({
            type: 'generic',
            index,
            name: parameterName,
          }),
        });

        if (findVariableInCurrentScope(context, parameterName)) {
          addError(context, {
            message: `variable with name '${parameterName}' is already declared in this scope`,
          });
          return defaultType;
        }

        addVariableToCurrentScope(context, {
          name: parameterName,
          type: defaultType,
          hasValue: true,
        });
        return defaultType;
      });
    return createType({ type: 'tuple', items: parametersTypes });
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
      createType({ type: 'generic', name: name.sourceString }),
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
      const figureOutParametersType =
        getFunctionValueParametersType(parameters);
      const returnType = returnExpression.getType();
      popTypeScope(context);

      if (figureOutParametersType.type !== 'tuple')
        return createType({ type: 'unknown' });

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
      const parametersItemsWithoutIndexType = parameters.getTypes();
      const parametersItemsType = parametersItemsWithoutIndexType.reduce<
        Type[]
      >((acc, current, index) => {
        if (current.type === 'generic') {
          const sameGeneric = acc.find(
            accItem =>
              accItem.type === 'generic' && accItem.name === current.name,
          ) as GenericType | undefined;
          acc.push({ ...current, index: sameGeneric?.index ?? index });
        } else acc.push(current);
        return acc;
      }, []);
      const parametersType = createType({
        type: 'tuple',
        items: parametersItemsType,
      });

      const getReturnType = () => {
        const returnMaybeWithoutIndexType = returnExpression.getType();
        // return generic type doesn't have correct index
        if (
          returnMaybeWithoutIndexType.type === 'generic' &&
          returnMaybeWithoutIndexType.index === undefined
        ) {
          const matchingParameter = parametersItemsType.find(
            parameter =>
              parameter.type === 'generic' &&
              parameter.name === returnMaybeWithoutIndexType.name,
          ) as GenericType | undefined;
          return {
            ...returnMaybeWithoutIndexType,
            index: matchingParameter?.index,
          };
        }
        return returnMaybeWithoutIndexType;
      };
      const returnType = getReturnType();

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
