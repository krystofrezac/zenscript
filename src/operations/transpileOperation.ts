import ohm, { NonterminalNode } from 'ohm-js';
import { BoringLangSemantics } from '../grammar.ohm-bundle';

const transpileJsExternalFunctionCall = (parameters: NonterminalNode) => {
  const transpiledParameters = parameters.transpile() as string;
  return transpiledParameters.substring(1, transpiledParameters.length - 1);
};

export const createTranspileOperation = (semantics: BoringLangSemantics) =>
  semantics.addOperation<ReturnType<ohm.Node['transpile']>>('transpile', {
    _iter: (...children) =>
      children.map(c => c.transpile()) as unknown as string,
    NonemptyListOf: (firstItem, _firstItemIterable, tailIterable) =>
      [firstItem.transpile(), ...tailIterable.transpile()].join(', '),
    EmptyListOf: () => '',
    Program_statements: (firstStatement, _newLines, secondStatement) =>
      firstStatement.transpile() + secondStatement.transpile(),
    Program_endStatement: statement => statement.transpile(),
    Statement: statement => statement.transpile() + '\n',
    VariableDeclaration_onlyValue: (identifier, valueAssignment) =>
      `const ${identifier.sourceString} ${valueAssignment.transpile()}`,
    VariableDeclaration_valueAndType: (
      identifier,
      _typeAssignment,
      valueAssignment,
    ) => `const ${identifier.sourceString} ${valueAssignment.transpile()}`,
    VariableDeclaration_onlyType: (_identifier, _typeAssignment) => '',
    ValueAssignment: (_equals, expression) => `= ${expression.transpile()}`,
    identifier: identifier => identifier.sourceString,
    compilerHook: (_atSign, identifier) => identifier.sourceString,
    numberExpression: number => number.sourceString,
    stringExpression: (_startQuotes, value, _endQuotes) =>
      '"' + value.sourceString + '"',
    trueExpression: _true => 'true',
    falseExpression: _false => 'false',
    Block: (_startCurlyBraces, blockStatements, _endCurlyBraces) =>
      '(()=>{\n' + blockStatements.transpile() + '\n})()',
    BlockStatement_statements: (statement, _emptyLines, blockStatement) =>
      statement.transpile() + blockStatement.transpile(),
    BlockStatement_endStatement: expression =>
      'return ' + expression.transpile(),
    FunctionDeclaration: (_startBracket, parameters, _endBracket, expression) =>
      '(' + parameters.transpile() + ')=>' + expression.transpile(),
    FunctionParameter: parametr => parametr.sourceString,
    FunctionCall_firstCall: (
      identifier,
      _startBracket,
      parameters,
      _endBracket,
    ) => {
      const transpiledIdentifier = identifier.transpile();
      if (transpiledIdentifier === 'jsExternal!')
        return transpileJsExternalFunctionCall(parameters);

      return transpiledIdentifier + '(' + parameters.transpile() + ')';
    },
    FunctionCall_firstCallCompilerHook: (
      compilerHook,
      _startBracket,
      parameters,
      _endBracket,
    ) => {
      const transpiledCompilerHook = compilerHook.transpile();
      if (transpiledCompilerHook !== 'jsValue') return transpiledCompilerHook;
      const transpiledParameters = parameters.transpile();
      return transpiledParameters.substring(1, transpiledParameters.length - 1);
    },
    FunctionCall_chainedCall: (
      prevFunctionCall,
      _startBracket,
      parameters,
      _endBracket,
    ) => prevFunctionCall.transpile() + '(' + parameters.transpile() + ')',
  });
