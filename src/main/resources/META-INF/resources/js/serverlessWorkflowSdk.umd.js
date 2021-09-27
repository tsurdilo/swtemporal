(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.serverWorkflowSdk = {}));
}(this, (function (exports) { 'use strict';

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var ValidationError$1 = /** @class */ (function () {
      function ValidationError(message) {
          this.message = message;
      }
      return ValidationError;
  }());

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var ajv$1 = {exports: {}};

  var core$3 = {};

  var validate$1 = {};

  var boolSchema = {};

  var errors$1 = {};

  var codegen = {};

  var code$1 = {};

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.regexpCode = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
  class _CodeOrName {
  }
  exports._CodeOrName = _CodeOrName;
  exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class Name extends _CodeOrName {
      constructor(s) {
          super();
          if (!exports.IDENTIFIER.test(s))
              throw new Error("CodeGen: name must be a valid identifier");
          this.str = s;
      }
      toString() {
          return this.str;
      }
      emptyStr() {
          return false;
      }
      get names() {
          return { [this.str]: 1 };
      }
  }
  exports.Name = Name;
  class _Code extends _CodeOrName {
      constructor(code) {
          super();
          this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
          return this.str;
      }
      emptyStr() {
          if (this._items.length > 1)
              return false;
          const item = this._items[0];
          return item === "" || item === '""';
      }
      get str() {
          var _a;
          return ((_a = this._str) !== null && _a !== void 0 ? _a : (this._str = this._items.reduce((s, c) => `${s}${c}`, "")));
      }
      get names() {
          var _a;
          return ((_a = this._names) !== null && _a !== void 0 ? _a : (this._names = this._items.reduce((names, c) => {
              if (c instanceof Name)
                  names[c.str] = (names[c.str] || 0) + 1;
              return names;
          }, {})));
      }
  }
  exports._Code = _Code;
  exports.nil = new _Code("");
  function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
          addCodeArg(code, args[i]);
          code.push(strs[++i]);
      }
      return new _Code(code);
  }
  exports._ = _;
  const plus = new _Code("+");
  function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
          expr.push(plus);
          addCodeArg(expr, args[i]);
          expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
  }
  exports.str = str;
  function addCodeArg(code, arg) {
      if (arg instanceof _Code)
          code.push(...arg._items);
      else if (arg instanceof Name)
          code.push(arg);
      else
          code.push(interpolate(arg));
  }
  exports.addCodeArg = addCodeArg;
  function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
          if (expr[i] === plus) {
              const res = mergeExprItems(expr[i - 1], expr[i + 1]);
              if (res !== undefined) {
                  expr.splice(i - 1, 3, res);
                  continue;
              }
              expr[i++] = "+";
          }
          i++;
      }
  }
  function mergeExprItems(a, b) {
      if (b === '""')
          return a;
      if (a === '""')
          return b;
      if (typeof a == "string") {
          if (b instanceof Name || a[a.length - 1] !== '"')
              return;
          if (typeof b != "string")
              return `${a.slice(0, -1)}${b}"`;
          if (b[0] === '"')
              return a.slice(0, -1) + b.slice(1);
          return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
          return `"${a}${b.slice(1)}`;
      return;
  }
  function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str `${c1}${c2}`;
  }
  exports.strConcat = strConcat;
  // TODO do not allow arrays here
  function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null
          ? x
          : safeStringify(Array.isArray(x) ? x.join(",") : x);
  }
  function stringify(x) {
      return new _Code(safeStringify(x));
  }
  exports.stringify = stringify;
  function safeStringify(x) {
      return JSON.stringify(x)
          .replace(/\u2028/g, "\\u2028")
          .replace(/\u2029/g, "\\u2029");
  }
  exports.safeStringify = safeStringify;
  function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _ `[${key}]`;
  }
  exports.getProperty = getProperty;
  function regexpCode(rx) {
      return new _Code(rx.toString());
  }
  exports.regexpCode = regexpCode;

  }(code$1));

  var scope = {};

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
  const code_1 = code$1;
  class ValueError extends Error {
      constructor(name) {
          super(`CodeGen: "code" for ${name} not defined`);
          this.value = name.value;
      }
  }
  var UsedValueState;
  (function (UsedValueState) {
      UsedValueState[UsedValueState["Started"] = 0] = "Started";
      UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
  })(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
  exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var"),
  };
  class Scope {
      constructor({ prefixes, parent } = {}) {
          this._names = {};
          this._prefixes = prefixes;
          this._parent = parent;
      }
      toName(nameOrPrefix) {
          return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
          return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
          const ng = this._names[prefix] || this._nameGroup(prefix);
          return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
          var _a, _b;
          if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || (this._prefixes && !this._prefixes.has(prefix))) {
              throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
          }
          return (this._names[prefix] = { prefix, index: 0 });
      }
  }
  exports.Scope = Scope;
  class ValueScopeName extends code_1.Name {
      constructor(prefix, nameStr) {
          super(nameStr);
          this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
          this.value = value;
          this.scopePath = code_1._ `.${new code_1.Name(property)}[${itemIndex}]`;
      }
  }
  exports.ValueScopeName = ValueScopeName;
  const line = code_1._ `\n`;
  class ValueScope extends Scope {
      constructor(opts) {
          super(opts);
          this._values = {};
          this._scope = opts.scope;
          this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
          return this._scope;
      }
      name(prefix) {
          return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
          var _a;
          if (value.ref === undefined)
              throw new Error("CodeGen: ref must be passed in value");
          const name = this.toName(nameOrPrefix);
          const { prefix } = name;
          const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
          let vs = this._values[prefix];
          if (vs) {
              const _name = vs.get(valueKey);
              if (_name)
                  return _name;
          }
          else {
              vs = this._values[prefix] = new Map();
          }
          vs.set(valueKey, name);
          const s = this._scope[prefix] || (this._scope[prefix] = []);
          const itemIndex = s.length;
          s[itemIndex] = value.ref;
          name.setValue(value, { property: prefix, itemIndex });
          return name;
      }
      getValue(prefix, keyOrRef) {
          const vs = this._values[prefix];
          if (!vs)
              return;
          return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
          return this._reduceValues(values, (name) => {
              if (name.scopePath === undefined)
                  throw new Error(`CodeGen: name "${name}" has no value`);
              return code_1._ `${scopeName}${name.scopePath}`;
          });
      }
      scopeCode(values = this._values, usedValues, getCode) {
          return this._reduceValues(values, (name) => {
              if (name.value === undefined)
                  throw new Error(`CodeGen: name "${name}" has no value`);
              return name.value.code;
          }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
          let code = code_1.nil;
          for (const prefix in values) {
              const vs = values[prefix];
              if (!vs)
                  continue;
              const nameSet = (usedValues[prefix] = usedValues[prefix] || new Map());
              vs.forEach((name) => {
                  if (nameSet.has(name))
                      return;
                  nameSet.set(name, UsedValueState.Started);
                  let c = valueCode(name);
                  if (c) {
                      const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
                      code = code_1._ `${code}${def} ${name} = ${c};${this.opts._n}`;
                  }
                  else if ((c = getCode === null || getCode === void 0 ? void 0 : getCode(name))) {
                      code = code_1._ `${code}${c}${this.opts._n}`;
                  }
                  else {
                      throw new ValueError(name);
                  }
                  nameSet.set(name, UsedValueState.Completed);
              });
          }
          return code;
      }
  }
  exports.ValueScope = ValueScope;

  }(scope));

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
  const code_1 = code$1;
  const scope_1 = scope;
  var code_2 = code$1;
  Object.defineProperty(exports, "_", { enumerable: true, get: function () { return code_2._; } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function () { return code_2.str; } });
  Object.defineProperty(exports, "strConcat", { enumerable: true, get: function () { return code_2.strConcat; } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return code_2.nil; } });
  Object.defineProperty(exports, "getProperty", { enumerable: true, get: function () { return code_2.getProperty; } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return code_2.stringify; } });
  Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function () { return code_2.regexpCode; } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return code_2.Name; } });
  var scope_2 = scope;
  Object.defineProperty(exports, "Scope", { enumerable: true, get: function () { return scope_2.Scope; } });
  Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function () { return scope_2.ValueScope; } });
  Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function () { return scope_2.ValueScopeName; } });
  Object.defineProperty(exports, "varKinds", { enumerable: true, get: function () { return scope_2.varKinds; } });
  exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+"),
  };
  class Node {
      optimizeNodes() {
          return this;
      }
      optimizeNames(_names, _constants) {
          return this;
      }
  }
  class Def extends Node {
      constructor(varKind, name, rhs) {
          super();
          this.varKind = varKind;
          this.name = name;
          this.rhs = rhs;
      }
      render({ es5, _n }) {
          const varKind = es5 ? scope_1.varKinds.var : this.varKind;
          const rhs = this.rhs === undefined ? "" : ` = ${this.rhs}`;
          return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
          if (!names[this.name.str])
              return;
          if (this.rhs)
              this.rhs = optimizeExpr(this.rhs, names, constants);
          return this;
      }
      get names() {
          return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
  }
  class Assign extends Node {
      constructor(lhs, rhs, sideEffects) {
          super();
          this.lhs = lhs;
          this.rhs = rhs;
          this.sideEffects = sideEffects;
      }
      render({ _n }) {
          return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
          if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
              return;
          this.rhs = optimizeExpr(this.rhs, names, constants);
          return this;
      }
      get names() {
          const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
          return addExprNames(names, this.rhs);
      }
  }
  class AssignOp extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
          super(lhs, rhs, sideEffects);
          this.op = op;
      }
      render({ _n }) {
          return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
  }
  class Label extends Node {
      constructor(label) {
          super();
          this.label = label;
          this.names = {};
      }
      render({ _n }) {
          return `${this.label}:` + _n;
      }
  }
  class Break extends Node {
      constructor(label) {
          super();
          this.label = label;
          this.names = {};
      }
      render({ _n }) {
          const label = this.label ? ` ${this.label}` : "";
          return `break${label};` + _n;
      }
  }
  class Throw extends Node {
      constructor(error) {
          super();
          this.error = error;
      }
      render({ _n }) {
          return `throw ${this.error};` + _n;
      }
      get names() {
          return this.error.names;
      }
  }
  class AnyCode extends Node {
      constructor(code) {
          super();
          this.code = code;
      }
      render({ _n }) {
          return `${this.code};` + _n;
      }
      optimizeNodes() {
          return `${this.code}` ? this : undefined;
      }
      optimizeNames(names, constants) {
          this.code = optimizeExpr(this.code, names, constants);
          return this;
      }
      get names() {
          return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
  }
  class ParentNode extends Node {
      constructor(nodes = []) {
          super();
          this.nodes = nodes;
      }
      render(opts) {
          return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
          const { nodes } = this;
          let i = nodes.length;
          while (i--) {
              const n = nodes[i].optimizeNodes();
              if (Array.isArray(n))
                  nodes.splice(i, 1, ...n);
              else if (n)
                  nodes[i] = n;
              else
                  nodes.splice(i, 1);
          }
          return nodes.length > 0 ? this : undefined;
      }
      optimizeNames(names, constants) {
          const { nodes } = this;
          let i = nodes.length;
          while (i--) {
              // iterating backwards improves 1-pass optimization
              const n = nodes[i];
              if (n.optimizeNames(names, constants))
                  continue;
              subtractNames(names, n.names);
              nodes.splice(i, 1);
          }
          return nodes.length > 0 ? this : undefined;
      }
      get names() {
          return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
  }
  class BlockNode extends ParentNode {
      render(opts) {
          return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
  }
  class Root extends ParentNode {
  }
  class Else extends BlockNode {
  }
  Else.kind = "else";
  class If extends BlockNode {
      constructor(condition, nodes) {
          super(nodes);
          this.condition = condition;
      }
      render(opts) {
          let code = `if(${this.condition})` + super.render(opts);
          if (this.else)
              code += "else " + this.else.render(opts);
          return code;
      }
      optimizeNodes() {
          super.optimizeNodes();
          const cond = this.condition;
          if (cond === true)
              return this.nodes; // else is ignored here
          let e = this.else;
          if (e) {
              const ns = e.optimizeNodes();
              e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
          }
          if (e) {
              if (cond === false)
                  return e instanceof If ? e : e.nodes;
              if (this.nodes.length)
                  return this;
              return new If(not(cond), e instanceof If ? [e] : e.nodes);
          }
          if (cond === false || !this.nodes.length)
              return undefined;
          return this;
      }
      optimizeNames(names, constants) {
          var _a;
          this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
          if (!(super.optimizeNames(names, constants) || this.else))
              return;
          this.condition = optimizeExpr(this.condition, names, constants);
          return this;
      }
      get names() {
          const names = super.names;
          addExprNames(names, this.condition);
          if (this.else)
              addNames(names, this.else.names);
          return names;
      }
  }
  If.kind = "if";
  class For extends BlockNode {
  }
  For.kind = "for";
  class ForLoop extends For {
      constructor(iteration) {
          super();
          this.iteration = iteration;
      }
      render(opts) {
          return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
          if (!super.optimizeNames(names, constants))
              return;
          this.iteration = optimizeExpr(this.iteration, names, constants);
          return this;
      }
      get names() {
          return addNames(super.names, this.iteration.names);
      }
  }
  class ForRange extends For {
      constructor(varKind, name, from, to) {
          super();
          this.varKind = varKind;
          this.name = name;
          this.from = from;
          this.to = to;
      }
      render(opts) {
          const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
          const { name, from, to } = this;
          return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
          const names = addExprNames(super.names, this.from);
          return addExprNames(names, this.to);
      }
  }
  class ForIter extends For {
      constructor(loop, varKind, name, iterable) {
          super();
          this.loop = loop;
          this.varKind = varKind;
          this.name = name;
          this.iterable = iterable;
      }
      render(opts) {
          return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
          if (!super.optimizeNames(names, constants))
              return;
          this.iterable = optimizeExpr(this.iterable, names, constants);
          return this;
      }
      get names() {
          return addNames(super.names, this.iterable.names);
      }
  }
  class Func extends BlockNode {
      constructor(name, args, async) {
          super();
          this.name = name;
          this.args = args;
          this.async = async;
      }
      render(opts) {
          const _async = this.async ? "async " : "";
          return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
  }
  Func.kind = "func";
  class Return extends ParentNode {
      render(opts) {
          return "return " + super.render(opts);
      }
  }
  Return.kind = "return";
  class Try extends BlockNode {
      render(opts) {
          let code = "try" + super.render(opts);
          if (this.catch)
              code += this.catch.render(opts);
          if (this.finally)
              code += this.finally.render(opts);
          return code;
      }
      optimizeNodes() {
          var _a, _b;
          super.optimizeNodes();
          (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
          (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
          return this;
      }
      optimizeNames(names, constants) {
          var _a, _b;
          super.optimizeNames(names, constants);
          (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
          (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
          return this;
      }
      get names() {
          const names = super.names;
          if (this.catch)
              addNames(names, this.catch.names);
          if (this.finally)
              addNames(names, this.finally.names);
          return names;
      }
  }
  class Catch extends BlockNode {
      constructor(error) {
          super();
          this.error = error;
      }
      render(opts) {
          return `catch(${this.error})` + super.render(opts);
      }
  }
  Catch.kind = "catch";
  class Finally extends BlockNode {
      render(opts) {
          return "finally" + super.render(opts);
      }
  }
  Finally.kind = "finally";
  class CodeGen {
      constructor(extScope, opts = {}) {
          this._values = {};
          this._blockStarts = [];
          this._constants = {};
          this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
          this._extScope = extScope;
          this._scope = new scope_1.Scope({ parent: extScope });
          this._nodes = [new Root()];
      }
      toString() {
          return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
          return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
          return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
          const name = this._extScope.value(prefixOrName, value);
          const vs = this._values[name.prefix] || (this._values[name.prefix] = new Set());
          vs.add(name);
          return name;
      }
      getScopeValue(prefix, keyOrRef) {
          return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
          return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
          return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
          const name = this._scope.toName(nameOrPrefix);
          if (rhs !== undefined && constant)
              this._constants[name.str] = rhs;
          this._leafNode(new Def(varKind, name, rhs));
          return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
          return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
          return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
          if (typeof c == "function")
              c();
          else if (c !== code_1.nil)
              this._leafNode(new AnyCode(c));
          return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
          const code = ["{"];
          for (const [key, value] of keyValues) {
              if (code.length > 1)
                  code.push(",");
              code.push(key);
              if (key !== value || this.opts.es5) {
                  code.push(":");
                  code_1.addCodeArg(code, value);
              }
          }
          code.push("}");
          return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
          this._blockNode(new If(condition));
          if (thenBody && elseBody) {
              this.code(thenBody).else().code(elseBody).endIf();
          }
          else if (thenBody) {
              this.code(thenBody).endIf();
          }
          else if (elseBody) {
              throw new Error('CodeGen: "else" body without "then" body');
          }
          return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
          return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
          return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
          return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
          this._blockNode(node);
          if (forBody)
              this.code(forBody).endFor();
          return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
          return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
          const name = this._scope.toName(nameOrPrefix);
          return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
          const name = this._scope.toName(nameOrPrefix);
          if (this.opts.es5) {
              const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
              return this.forRange("_i", 0, code_1._ `${arr}.length`, (i) => {
                  this.var(name, code_1._ `${arr}[${i}]`);
                  forBody(name);
              });
          }
          return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
          if (this.opts.ownProperties) {
              return this.forOf(nameOrPrefix, code_1._ `Object.keys(${obj})`, forBody);
          }
          const name = this._scope.toName(nameOrPrefix);
          return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
          return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
          return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
          return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
          const node = new Return();
          this._blockNode(node);
          this.code(value);
          if (node.nodes.length !== 1)
              throw new Error('CodeGen: "return" should have one node');
          return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
          if (!catchCode && !finallyCode)
              throw new Error('CodeGen: "try" without "catch" and "finally"');
          const node = new Try();
          this._blockNode(node);
          this.code(tryBody);
          if (catchCode) {
              const error = this.name("e");
              this._currNode = node.catch = new Catch(error);
              catchCode(error);
          }
          if (finallyCode) {
              this._currNode = node.finally = new Finally();
              this.code(finallyCode);
          }
          return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
          return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
          this._blockStarts.push(this._nodes.length);
          if (body)
              this.code(body).endBlock(nodeCount);
          return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
          const len = this._blockStarts.pop();
          if (len === undefined)
              throw new Error("CodeGen: not in self-balancing block");
          const toClose = this._nodes.length - len;
          if (toClose < 0 || (nodeCount !== undefined && toClose !== nodeCount)) {
              throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
          }
          this._nodes.length = len;
          return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
          this._blockNode(new Func(name, args, async));
          if (funcBody)
              this.code(funcBody).endFunc();
          return this;
      }
      // end function definition
      endFunc() {
          return this._endBlockNode(Func);
      }
      optimize(n = 1) {
          while (n-- > 0) {
              this._root.optimizeNodes();
              this._root.optimizeNames(this._root.names, this._constants);
          }
      }
      _leafNode(node) {
          this._currNode.nodes.push(node);
          return this;
      }
      _blockNode(node) {
          this._currNode.nodes.push(node);
          this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
          const n = this._currNode;
          if (n instanceof N1 || (N2 && n instanceof N2)) {
              this._nodes.pop();
              return this;
          }
          throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
          const n = this._currNode;
          if (!(n instanceof If)) {
              throw new Error('CodeGen: "else" without "if"');
          }
          this._currNode = n.else = node;
          return this;
      }
      get _root() {
          return this._nodes[0];
      }
      get _currNode() {
          const ns = this._nodes;
          return ns[ns.length - 1];
      }
      set _currNode(node) {
          const ns = this._nodes;
          ns[ns.length - 1] = node;
      }
  }
  exports.CodeGen = CodeGen;
  function addNames(names, from) {
      for (const n in from)
          names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
  }
  function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
  }
  function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
          return replaceName(expr);
      if (!canOptimize(expr))
          return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
          if (c instanceof code_1.Name)
              c = replaceName(c);
          if (c instanceof code_1._Code)
              items.push(...c._items);
          else
              items.push(c);
          return items;
      }, []));
      function replaceName(n) {
          const c = constants[n.str];
          if (c === undefined || names[n.str] !== 1)
              return n;
          delete names[n.str];
          return c;
      }
      function canOptimize(e) {
          return (e instanceof code_1._Code &&
              e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== undefined));
      }
  }
  function subtractNames(names, from) {
      for (const n in from)
          names[n] = (names[n] || 0) - (from[n] || 0);
  }
  function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : code_1._ `!${par(x)}`;
  }
  exports.not = not;
  const andCode = mappend(exports.operators.AND);
  // boolean AND (&&) expression with the passed arguments
  function and(...args) {
      return args.reduce(andCode);
  }
  exports.and = and;
  const orCode = mappend(exports.operators.OR);
  // boolean OR (||) expression with the passed arguments
  function or(...args) {
      return args.reduce(orCode);
  }
  exports.or = or;
  function mappend(op) {
      return (x, y) => (x === code_1.nil ? y : y === code_1.nil ? x : code_1._ `${par(x)} ${op} ${par(y)}`);
  }
  function par(x) {
      return x instanceof code_1.Name ? x : code_1._ `(${x})`;
  }

  }(codegen));

  var util = {};

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
  const codegen_1 = codegen;
  const code_1 = code$1;
  // TODO refactor to use Set
  function toHash(arr) {
      const hash = {};
      for (const item of arr)
          hash[item] = true;
      return hash;
  }
  exports.toHash = toHash;
  function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
          return schema;
      if (Object.keys(schema).length === 0)
          return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
  }
  exports.alwaysValidSchema = alwaysValidSchema;
  function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
          return;
      if (typeof schema === "boolean")
          return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
          if (!rules[key])
              checkStrictMode(it, `unknown keyword: "${key}"`);
      }
  }
  exports.checkUnknownRules = checkUnknownRules;
  function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
          return !schema;
      for (const key in schema)
          if (rules[key])
              return true;
      return false;
  }
  exports.schemaHasRules = schemaHasRules;
  function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
          return !schema;
      for (const key in schema)
          if (key !== "$ref" && RULES.all[key])
              return true;
      return false;
  }
  exports.schemaHasRulesButRef = schemaHasRulesButRef;
  function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
          if (typeof schema == "number" || typeof schema == "boolean")
              return schema;
          if (typeof schema == "string")
              return codegen_1._ `${schema}`;
      }
      return codegen_1._ `${topSchemaRef}${schemaPath}${codegen_1.getProperty(keyword)}`;
  }
  exports.schemaRefOrVal = schemaRefOrVal;
  function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
  }
  exports.unescapeFragment = unescapeFragment;
  function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
  }
  exports.escapeFragment = escapeFragment;
  function escapeJsonPointer(str) {
      if (typeof str == "number")
          return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  exports.escapeJsonPointer = escapeJsonPointer;
  function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  exports.unescapeJsonPointer = unescapeJsonPointer;
  function eachItem(xs, f) {
      if (Array.isArray(xs)) {
          for (const x of xs)
              f(x);
      }
      else {
          f(xs);
      }
  }
  exports.eachItem = eachItem;
  function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName, }) {
      return (gen, from, to, toName) => {
          const res = to === undefined
              ? from
              : to instanceof codegen_1.Name
                  ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to)
                  : from instanceof codegen_1.Name
                      ? (mergeToName(gen, to, from), from)
                      : mergeValues(from, to);
          return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
  }
  exports.mergeEvaluated = {
      props: makeMergeEvaluated({
          mergeNames: (gen, from, to) => gen.if(codegen_1._ `${to} !== true && ${from} !== undefined`, () => {
              gen.if(codegen_1._ `${from} === true`, () => gen.assign(to, true), () => gen.assign(to, codegen_1._ `${to} || {}`).code(codegen_1._ `Object.assign(${to}, ${from})`));
          }),
          mergeToName: (gen, from, to) => gen.if(codegen_1._ `${to} !== true`, () => {
              if (from === true) {
                  gen.assign(to, true);
              }
              else {
                  gen.assign(to, codegen_1._ `${to} || {}`);
                  setEvaluated(gen, to, from);
              }
          }),
          mergeValues: (from, to) => (from === true ? true : { ...from, ...to }),
          resultToName: evaluatedPropsToName,
      }),
      items: makeMergeEvaluated({
          mergeNames: (gen, from, to) => gen.if(codegen_1._ `${to} !== true && ${from} !== undefined`, () => gen.assign(to, codegen_1._ `${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
          mergeToName: (gen, from, to) => gen.if(codegen_1._ `${to} !== true`, () => gen.assign(to, from === true ? true : codegen_1._ `${to} > ${from} ? ${to} : ${from}`)),
          mergeValues: (from, to) => (from === true ? true : Math.max(from, to)),
          resultToName: (gen, items) => gen.var("items", items),
      }),
  };
  function evaluatedPropsToName(gen, ps) {
      if (ps === true)
          return gen.var("props", true);
      const props = gen.var("props", codegen_1._ `{}`);
      if (ps !== undefined)
          setEvaluated(gen, props, ps);
      return props;
  }
  exports.evaluatedPropsToName = evaluatedPropsToName;
  function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign(codegen_1._ `${props}${codegen_1.getProperty(p)}`, true));
  }
  exports.setEvaluated = setEvaluated;
  const snippets = {};
  function useFunc(gen, f) {
      return gen.scopeValue("func", {
          ref: f,
          code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code)),
      });
  }
  exports.useFunc = useFunc;
  var Type;
  (function (Type) {
      Type[Type["Num"] = 0] = "Num";
      Type[Type["Str"] = 1] = "Str";
  })(Type = exports.Type || (exports.Type = {}));
  function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      // let path
      if (dataProp instanceof codegen_1.Name) {
          const isNumber = dataPropType === Type.Num;
          return jsPropertySyntax
              ? isNumber
                  ? codegen_1._ `"[" + ${dataProp} + "]"`
                  : codegen_1._ `"['" + ${dataProp} + "']"`
              : isNumber
                  ? codegen_1._ `"/" + ${dataProp}`
                  : codegen_1._ `"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`; // TODO maybe use global escapePointer
      }
      return jsPropertySyntax ? codegen_1.getProperty(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
  }
  exports.getErrorPath = getErrorPath;
  function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
          return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
          throw new Error(msg);
      it.self.logger.warn(msg);
  }
  exports.checkStrictMode = checkStrictMode;

  }(util));

  var names$1 = {};

  Object.defineProperty(names$1, "__esModule", { value: true });
  const codegen_1$t = codegen;
  const names = {
      // validation function arguments
      data: new codegen_1$t.Name("data"),
      // args passed from referencing schema
      valCxt: new codegen_1$t.Name("valCxt"),
      instancePath: new codegen_1$t.Name("instancePath"),
      parentData: new codegen_1$t.Name("parentData"),
      parentDataProperty: new codegen_1$t.Name("parentDataProperty"),
      rootData: new codegen_1$t.Name("rootData"),
      dynamicAnchors: new codegen_1$t.Name("dynamicAnchors"),
      // function scoped variables
      vErrors: new codegen_1$t.Name("vErrors"),
      errors: new codegen_1$t.Name("errors"),
      this: new codegen_1$t.Name("this"),
      // "globals"
      self: new codegen_1$t.Name("self"),
      scope: new codegen_1$t.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1$t.Name("json"),
      jsonPos: new codegen_1$t.Name("jsonPos"),
      jsonLen: new codegen_1$t.Name("jsonLen"),
      jsonPart: new codegen_1$t.Name("jsonPart"),
  };
  names$1.default = names;

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
  const codegen_1 = codegen;
  const util_1 = util;
  const names_1 = names$1;
  exports.keywordError = {
      message: ({ keyword }) => codegen_1.str `must pass "${keyword}" keyword validation`,
  };
  exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType
          ? codegen_1.str `"${keyword}" keyword must be ${schemaType} ($data)`
          : codegen_1.str `"${keyword}" keyword is invalid ($data)`,
  };
  function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : (compositeRule || allErrors)) {
          addError(gen, errObj);
      }
      else {
          returnErrors(it, codegen_1._ `[${errObj}]`);
      }
  }
  exports.reportError = reportError;
  function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
          returnErrors(it, names_1.default.vErrors);
      }
  }
  exports.reportExtraError = reportExtraError;
  function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if(codegen_1._ `${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign(codegen_1._ `${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
  }
  exports.resetErrorsCount = resetErrorsCount;
  function extendErrors({ gen, keyword, schemaValue, data, errsCount, it, }) {
      /* istanbul ignore if */
      if (errsCount === undefined)
          throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
          gen.const(err, codegen_1._ `${names_1.default.vErrors}[${i}]`);
          gen.if(codegen_1._ `${err}.instancePath === undefined`, () => gen.assign(codegen_1._ `${err}.instancePath`, codegen_1.strConcat(names_1.default.instancePath, it.errorPath)));
          gen.assign(codegen_1._ `${err}.schemaPath`, codegen_1.str `${it.errSchemaPath}/${keyword}`);
          if (it.opts.verbose) {
              gen.assign(codegen_1._ `${err}.schema`, schemaValue);
              gen.assign(codegen_1._ `${err}.data`, data);
          }
      });
  }
  exports.extendErrors = extendErrors;
  function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if(codegen_1._ `${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, codegen_1._ `[${err}]`), codegen_1._ `${names_1.default.vErrors}.push(${err})`);
      gen.code(codegen_1._ `${names_1.default.errors}++`);
  }
  function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
          gen.throw(codegen_1._ `new ${it.ValidationError}(${errs})`);
      }
      else {
          gen.assign(codegen_1._ `${validateName}.errors`, errs);
          gen.return(false);
      }
  }
  const E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema"),
  };
  function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
          return codegen_1._ `{}`;
      return errorObject(cxt, error, errorPaths);
  }
  function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
          errorInstancePath(it, errorPaths),
          errorSchemaPath(cxt, errorPaths),
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
  }
  function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath
          ? codegen_1.str `${errorPath}${util_1.getErrorPath(instancePath, util_1.Type.Str)}`
          : errorPath;
      return [names_1.default.instancePath, codegen_1.strConcat(names_1.default.instancePath, instPath)];
  }
  function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : codegen_1.str `${errSchemaPath}/${keyword}`;
      if (schemaPath) {
          schPath = codegen_1.str `${schPath}${util_1.getErrorPath(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
  }
  function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || codegen_1._ `{}`]);
      if (opts.messages) {
          keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
          keyValues.push([E.schema, schemaValue], [E.parentSchema, codegen_1._ `${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
          keyValues.push([E.propertyName, propertyName]);
  }

  }(errors$1));

  Object.defineProperty(boolSchema, "__esModule", { value: true });
  boolSchema.boolOrEmptySchema = boolSchema.topBoolOrEmptySchema = void 0;
  const errors_1$2 = errors$1;
  const codegen_1$s = codegen;
  const names_1$6 = names$1;
  const boolError = {
      message: "boolean schema is false",
  };
  function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
          falseSchemaError(it, false);
      }
      else if (typeof schema == "object" && schema.$async === true) {
          gen.return(names_1$6.default.data);
      }
      else {
          gen.assign(codegen_1$s._ `${validateName}.errors`, null);
          gen.return(true);
      }
  }
  boolSchema.topBoolOrEmptySchema = topBoolOrEmptySchema;
  function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
          gen.var(valid, false); // TODO var
          falseSchemaError(it);
      }
      else {
          gen.var(valid, true); // TODO var
      }
  }
  boolSchema.boolOrEmptySchema = boolOrEmptySchema;
  function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      // TODO maybe some other interface should be used for non-keyword validation errors...
      const cxt = {
          gen,
          keyword: "false schema",
          data,
          schema: false,
          schemaCode: false,
          schemaValue: false,
          params: {},
          it,
      };
      errors_1$2.reportError(cxt, boolError, undefined, overrideAllErrors);
  }

  var dataType = {};

  var rules = {};

  Object.defineProperty(rules, "__esModule", { value: true });
  rules.getRules = rules.isJSONType = void 0;
  const _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
  const jsonTypes = new Set(_jsonTypes);
  function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
  }
  rules.isJSONType = isJSONType;
  function getRules() {
      const groups = {
          number: { type: "number", rules: [] },
          string: { type: "string", rules: [] },
          array: { type: "array", rules: [] },
          object: { type: "object", rules: [] },
      };
      return {
          types: { ...groups, integer: true, boolean: true, null: true },
          rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
          post: { rules: [] },
          all: {},
          keywords: {},
      };
  }
  rules.getRules = getRules;

  var applicability = {};

  Object.defineProperty(applicability, "__esModule", { value: true });
  applicability.shouldUseRule = applicability.shouldUseGroup = applicability.schemaHasRulesForType = void 0;
  function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
  }
  applicability.schemaHasRulesForType = schemaHasRulesForType;
  function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
  }
  applicability.shouldUseGroup = shouldUseGroup;
  function shouldUseRule(schema, rule) {
      var _a;
      return (schema[rule.keyword] !== undefined ||
          ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== undefined)));
  }
  applicability.shouldUseRule = shouldUseRule;

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
  const rules_1 = rules;
  const applicability_1 = applicability;
  const errors_1 = errors$1;
  const codegen_1 = codegen;
  const util_1 = util;
  var DataType;
  (function (DataType) {
      DataType[DataType["Correct"] = 0] = "Correct";
      DataType[DataType["Wrong"] = 1] = "Wrong";
  })(DataType = exports.DataType || (exports.DataType = {}));
  function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
          if (schema.nullable === false)
              throw new Error("type: null contradicts nullable: false");
      }
      else {
          if (!types.length && schema.nullable !== undefined) {
              throw new Error('"nullable" cannot be used without "type"');
          }
          if (schema.nullable === true)
              types.push("null");
      }
      return types;
  }
  exports.getSchemaTypes = getSchemaTypes;
  function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
          return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
  }
  exports.getJSONTypes = getJSONTypes;
  function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 &&
          !(coerceTo.length === 0 && types.length === 1 && applicability_1.schemaHasRulesForType(it, types[0]));
      if (checkTypes) {
          const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
          gen.if(wrongType, () => {
              if (coerceTo.length)
                  coerceData(it, types, coerceTo);
              else
                  reportTypeError(it);
          });
      }
      return checkTypes;
  }
  exports.coerceAndCheckDataType = coerceAndCheckDataType;
  const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
  function coerceToTypes(types, coerceTypes) {
      return coerceTypes
          ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
          : [];
  }
  function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", codegen_1._ `typeof ${data}`);
      const coerced = gen.let("coerced", codegen_1._ `undefined`);
      if (opts.coerceTypes === "array") {
          gen.if(codegen_1._ `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
              .assign(data, codegen_1._ `${data}[0]`)
              .assign(dataType, codegen_1._ `typeof ${data}`)
              .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if(codegen_1._ `${coerced} !== undefined`);
      for (const t of coerceTo) {
          if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
              coerceSpecificType(t);
          }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if(codegen_1._ `${coerced} !== undefined`, () => {
          gen.assign(data, coerced);
          assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
          switch (t) {
              case "string":
                  gen
                      .elseIf(codegen_1._ `${dataType} == "number" || ${dataType} == "boolean"`)
                      .assign(coerced, codegen_1._ `"" + ${data}`)
                      .elseIf(codegen_1._ `${data} === null`)
                      .assign(coerced, codegen_1._ `""`);
                  return;
              case "number":
                  gen
                      .elseIf(codegen_1._ `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                      .assign(coerced, codegen_1._ `+${data}`);
                  return;
              case "integer":
                  gen
                      .elseIf(codegen_1._ `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                      .assign(coerced, codegen_1._ `+${data}`);
                  return;
              case "boolean":
                  gen
                      .elseIf(codegen_1._ `${data} === "false" || ${data} === 0 || ${data} === null`)
                      .assign(coerced, false)
                      .elseIf(codegen_1._ `${data} === "true" || ${data} === 1`)
                      .assign(coerced, true);
                  return;
              case "null":
                  gen.elseIf(codegen_1._ `${data} === "" || ${data} === 0 || ${data} === false`);
                  gen.assign(coerced, null);
                  return;
              case "array":
                  gen
                      .elseIf(codegen_1._ `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                      .assign(coerced, codegen_1._ `[${data}]`);
          }
      }
  }
  function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      // TODO use gen.property
      gen.if(codegen_1._ `${parentData} !== undefined`, () => gen.assign(codegen_1._ `${parentData}[${parentDataProperty}]`, expr));
  }
  function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
          case "null":
              return codegen_1._ `${data} ${EQ} null`;
          case "array":
              cond = codegen_1._ `Array.isArray(${data})`;
              break;
          case "object":
              cond = codegen_1._ `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
              break;
          case "integer":
              cond = numCond(codegen_1._ `!(${data} % 1) && !isNaN(${data})`);
              break;
          case "number":
              cond = numCond();
              break;
          default:
              return codegen_1._ `typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : codegen_1.not(cond);
      function numCond(_cond = codegen_1.nil) {
          return codegen_1.and(codegen_1._ `typeof ${data} == "number"`, _cond, strictNums ? codegen_1._ `isFinite(${data})` : codegen_1.nil);
      }
  }
  exports.checkDataType = checkDataType;
  function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
          return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = util_1.toHash(dataTypes);
      if (types.array && types.object) {
          const notObj = codegen_1._ `typeof ${data} != "object"`;
          cond = types.null ? notObj : codegen_1._ `!${data} || ${notObj}`;
          delete types.null;
          delete types.array;
          delete types.object;
      }
      else {
          cond = codegen_1.nil;
      }
      if (types.number)
          delete types.integer;
      for (const t in types)
          cond = codegen_1.and(cond, checkDataType(t, data, strictNums, correct));
      return cond;
  }
  exports.checkDataTypes = checkDataTypes;
  const typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? codegen_1._ `{type: ${schema}}` : codegen_1._ `{type: ${schemaValue}}`,
  };
  function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      errors_1.reportError(cxt, typeError);
  }
  exports.reportTypeError = reportTypeError;
  function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = util_1.schemaRefOrVal(it, schema, "type");
      return {
          gen,
          keyword: "type",
          data,
          schema: schema.type,
          schemaCode,
          schemaValue: schemaCode,
          parentSchema: schema,
          params: {},
          it,
      };
  }

  }(dataType));

  var defaults = {};

  Object.defineProperty(defaults, "__esModule", { value: true });
  defaults.assignDefaults = void 0;
  const codegen_1$r = codegen;
  const util_1$o = util;
  function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
          for (const key in properties) {
              assignDefault(it, key, properties[key].default);
          }
      }
      else if (ty === "array" && Array.isArray(items)) {
          items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
  }
  defaults.assignDefaults = assignDefaults;
  function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === undefined)
          return;
      const childData = codegen_1$r._ `${data}${codegen_1$r.getProperty(prop)}`;
      if (compositeRule) {
          util_1$o.checkStrictMode(it, `default is ignored for: ${childData}`);
          return;
      }
      let condition = codegen_1$r._ `${childData} === undefined`;
      if (opts.useDefaults === "empty") {
          condition = codegen_1$r._ `${condition} || ${childData} === null || ${childData} === ""`;
      }
      // `${childData} === undefined` +
      // (opts.useDefaults === "empty" ? ` || ${childData} === null || ${childData} === ""` : "")
      gen.if(condition, codegen_1$r._ `${childData} = ${codegen_1$r.stringify(defaultValue)}`);
  }

  var keyword = {};

  var code = {};

  Object.defineProperty(code, "__esModule", { value: true });
  code.validateUnion = code.validateArray = code.usePattern = code.callValidateCode = code.schemaProperties = code.allSchemaProperties = code.noPropertyInData = code.propertyInData = code.isOwnProperty = code.hasPropFunc = code.reportMissingProp = code.checkMissingProp = code.checkReportMissingProp = void 0;
  const codegen_1$q = codegen;
  const util_1$n = util;
  const names_1$5 = names$1;
  function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
          cxt.setParams({ missingProperty: codegen_1$q._ `${prop}` }, true);
          cxt.error();
      });
  }
  code.checkReportMissingProp = checkReportMissingProp;
  function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return codegen_1$q.or(...properties.map((prop) => codegen_1$q.and(noPropertyInData(gen, data, prop, opts.ownProperties), codegen_1$q._ `${missing} = ${prop}`)));
  }
  code.checkMissingProp = checkMissingProp;
  function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
  }
  code.reportMissingProp = reportMissingProp;
  function hasPropFunc(gen) {
      return gen.scopeValue("func", {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          ref: Object.prototype.hasOwnProperty,
          code: codegen_1$q._ `Object.prototype.hasOwnProperty`,
      });
  }
  code.hasPropFunc = hasPropFunc;
  function isOwnProperty(gen, data, property) {
      return codegen_1$q._ `${hasPropFunc(gen)}.call(${data}, ${property})`;
  }
  code.isOwnProperty = isOwnProperty;
  function propertyInData(gen, data, property, ownProperties) {
      const cond = codegen_1$q._ `${data}${codegen_1$q.getProperty(property)} !== undefined`;
      return ownProperties ? codegen_1$q._ `${cond} && ${isOwnProperty(gen, data, property)}` : cond;
  }
  code.propertyInData = propertyInData;
  function noPropertyInData(gen, data, property, ownProperties) {
      const cond = codegen_1$q._ `${data}${codegen_1$q.getProperty(property)} === undefined`;
      return ownProperties ? codegen_1$q.or(cond, codegen_1$q.not(isOwnProperty(gen, data, property))) : cond;
  }
  code.noPropertyInData = noPropertyInData;
  function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
  }
  code.allSchemaProperties = allSchemaProperties;
  function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !util_1$n.alwaysValidSchema(it, schemaMap[p]));
  }
  code.schemaProperties = schemaProperties;
  function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? codegen_1$q._ `${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
          [names_1$5.default.instancePath, codegen_1$q.strConcat(names_1$5.default.instancePath, errorPath)],
          [names_1$5.default.parentData, it.parentData],
          [names_1$5.default.parentDataProperty, it.parentDataProperty],
          [names_1$5.default.rootData, names_1$5.default.rootData],
      ];
      if (it.opts.dynamicRef)
          valCxt.push([names_1$5.default.dynamicAnchors, names_1$5.default.dynamicAnchors]);
      const args = codegen_1$q._ `${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1$q.nil ? codegen_1$q._ `${func}.call(${context}, ${args})` : codegen_1$q._ `${func}(${args})`;
  }
  code.callValidateCode = callValidateCode;
  function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      return gen.scopeValue("pattern", {
          key: pattern,
          ref: new RegExp(pattern, u),
          code: codegen_1$q._ `new RegExp(${pattern}, ${u})`,
      });
  }
  code.usePattern = usePattern;
  function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
          const validArr = gen.let("valid", true);
          validateItems(() => gen.assign(validArr, false));
          return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
          const len = gen.const("len", codegen_1$q._ `${data}.length`);
          gen.forRange("i", 0, len, (i) => {
              cxt.subschema({
                  keyword,
                  dataProp: i,
                  dataPropType: util_1$n.Type.Num,
              }, valid);
              gen.if(codegen_1$q.not(valid), notValid);
          });
      }
  }
  code.validateArray = validateArray;
  function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      /* istanbul ignore if */
      if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => util_1$n.alwaysValidSchema(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
          return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
          const schCxt = cxt.subschema({
              keyword,
              schemaProp: i,
              compositeRule: true,
          }, schValid);
          gen.assign(valid, codegen_1$q._ `${valid} || ${schValid}`);
          const merged = cxt.mergeValidEvaluated(schCxt, schValid);
          // can short-circuit if `unevaluatedProperties/Items` not supported (opts.unevaluated !== true)
          // or if all properties and items were evaluated (it.props === true && it.items === true)
          if (!merged)
              gen.if(codegen_1$q.not(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
  }
  code.validateUnion = validateUnion;

  Object.defineProperty(keyword, "__esModule", { value: true });
  keyword.validateKeywordUsage = keyword.validSchemaType = keyword.funcKeywordCode = keyword.macroKeywordCode = void 0;
  const codegen_1$p = codegen;
  const names_1$4 = names$1;
  const code_1$9 = code;
  const errors_1$1 = errors$1;
  function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
          it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
          schema: macroSchema,
          schemaPath: codegen_1$p.nil,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`,
          topSchemaRef: schemaRef,
          compositeRule: true,
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
  }
  keyword.macroKeywordCode = macroKeywordCode;
  function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
          if (def.errors === false) {
              assignValid();
              if (def.modifying)
                  modifyData(cxt);
              reportErrs(() => cxt.error());
          }
          else {
              const ruleErrs = def.async ? validateAsync() : validateSync();
              if (def.modifying)
                  modifyData(cxt);
              reportErrs(() => addErrs(cxt, ruleErrs));
          }
      }
      function validateAsync() {
          const ruleErrs = gen.let("ruleErrs", null);
          gen.try(() => assignValid(codegen_1$p._ `await `), (e) => gen.assign(valid, false).if(codegen_1$p._ `${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, codegen_1$p._ `${e}.errors`), () => gen.throw(e)));
          return ruleErrs;
      }
      function validateSync() {
          const validateErrs = codegen_1$p._ `${validateRef}.errors`;
          gen.assign(validateErrs, null);
          assignValid(codegen_1$p.nil);
          return validateErrs;
      }
      function assignValid(_await = def.async ? codegen_1$p._ `await ` : codegen_1$p.nil) {
          const passCxt = it.opts.passContext ? names_1$4.default.this : names_1$4.default.self;
          const passSchema = !(("compile" in def && !$data) || def.schema === false);
          gen.assign(valid, codegen_1$p._ `${_await}${code_1$9.callValidateCode(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
          var _a;
          gen.if(codegen_1$p.not((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
      }
  }
  keyword.funcKeywordCode = funcKeywordCode;
  function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, codegen_1$p._ `${it.parentData}[${it.parentDataProperty}]`));
  }
  function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if(codegen_1$p._ `Array.isArray(${errs})`, () => {
          gen
              .assign(names_1$4.default.vErrors, codegen_1$p._ `${names_1$4.default.vErrors} === null ? ${errs} : ${names_1$4.default.vErrors}.concat(${errs})`)
              .assign(names_1$4.default.errors, codegen_1$p._ `${names_1$4.default.vErrors}.length`);
          errors_1$1.extendErrors(cxt);
      }, () => cxt.error());
  }
  function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
          throw new Error("async keyword in sync schema");
  }
  function useKeyword(gen, keyword, result) {
      if (result === undefined)
          throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: codegen_1$p.stringify(result) });
  }
  function validSchemaType(schema, schemaType, allowUndefined = false) {
      // TODO add tests
      return (!schemaType.length ||
          schemaType.some((st) => st === "array"
              ? Array.isArray(schema)
              : st === "object"
                  ? schema && typeof schema == "object" && !Array.isArray(schema)
                  : typeof schema == st || (allowUndefined && typeof schema == "undefined")));
  }
  keyword.validSchemaType = validSchemaType;
  function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      /* istanbul ignore if */
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
          throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
          throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
          const valid = def.validateSchema(schema[keyword]);
          if (!valid) {
              const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` +
                  self.errorsText(def.validateSchema.errors);
              if (opts.validateSchema === "log")
                  self.logger.error(msg);
              else
                  throw new Error(msg);
          }
      }
  }
  keyword.validateKeywordUsage = validateKeywordUsage;

  var subschema = {};

  Object.defineProperty(subschema, "__esModule", { value: true });
  subschema.extendSubschemaMode = subschema.extendSubschemaData = subschema.getSubschema = void 0;
  const codegen_1$o = codegen;
  const util_1$m = util;
  function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== undefined && schema !== undefined) {
          throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== undefined) {
          const sch = it.schema[keyword];
          return schemaProp === undefined
              ? {
                  schema: sch,
                  schemaPath: codegen_1$o._ `${it.schemaPath}${codegen_1$o.getProperty(keyword)}`,
                  errSchemaPath: `${it.errSchemaPath}/${keyword}`,
              }
              : {
                  schema: sch[schemaProp],
                  schemaPath: codegen_1$o._ `${it.schemaPath}${codegen_1$o.getProperty(keyword)}${codegen_1$o.getProperty(schemaProp)}`,
                  errSchemaPath: `${it.errSchemaPath}/${keyword}/${util_1$m.escapeFragment(schemaProp)}`,
              };
      }
      if (schema !== undefined) {
          if (schemaPath === undefined || errSchemaPath === undefined || topSchemaRef === undefined) {
              throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
          }
          return {
              schema,
              schemaPath,
              topSchemaRef,
              errSchemaPath,
          };
      }
      throw new Error('either "keyword" or "schema" must be passed');
  }
  subschema.getSubschema = getSubschema;
  function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== undefined && dataProp !== undefined) {
          throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== undefined) {
          const { errorPath, dataPathArr, opts } = it;
          const nextData = gen.let("data", codegen_1$o._ `${it.data}${codegen_1$o.getProperty(dataProp)}`, true);
          dataContextProps(nextData);
          subschema.errorPath = codegen_1$o.str `${errorPath}${util_1$m.getErrorPath(dataProp, dpType, opts.jsPropertySyntax)}`;
          subschema.parentDataProperty = codegen_1$o._ `${dataProp}`;
          subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== undefined) {
          const nextData = data instanceof codegen_1$o.Name ? data : gen.let("data", data, true); // replaceable if used once?
          dataContextProps(nextData);
          if (propertyName !== undefined)
              subschema.propertyName = propertyName;
          // TODO something is possibly wrong here with not changing parentDataProperty and not appending dataPathArr
      }
      if (dataTypes)
          subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
          subschema.data = _nextData;
          subschema.dataLevel = it.dataLevel + 1;
          subschema.dataTypes = [];
          it.definedProperties = new Set();
          subschema.parentData = it.data;
          subschema.dataNames = [...it.dataNames, _nextData];
      }
  }
  subschema.extendSubschemaData = extendSubschemaData;
  function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== undefined)
          subschema.compositeRule = compositeRule;
      if (createErrors !== undefined)
          subschema.createErrors = createErrors;
      if (allErrors !== undefined)
          subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator; // not inherited
      subschema.jtdMetadata = jtdMetadata; // not inherited
  }
  subschema.extendSubschemaMode = extendSubschemaMode;

  var resolve$1 = {};

  // do not edit .js files directly - edit src/index.jst



  var fastDeepEqual = function equal(a, b) {
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
      if (a.constructor !== b.constructor) return false;

      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (!equal(a[i], b[i])) return false;
        return true;
      }



      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0;)
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

      for (i = length; i-- !== 0;) {
        var key = keys[i];

        if (!equal(a[key], b[key])) return false;
      }

      return true;
    }

    // true if both NaN, false otherwise
    return a!==a && b!==b;
  };

  var jsonSchemaTraverse = {exports: {}};

  var traverse$1 = jsonSchemaTraverse.exports = function (schema, opts, cb) {
    // Legacy support for v0.3.1 and earlier.
    if (typeof opts == 'function') {
      cb = opts;
      opts = {};
    }

    cb = opts.cb || cb;
    var pre = (typeof cb == 'function') ? cb : cb.pre || function() {};
    var post = cb.post || function() {};

    _traverse(opts, pre, post, schema, '', schema);
  };


  traverse$1.keywords = {
    additionalItems: true,
    items: true,
    contains: true,
    additionalProperties: true,
    propertyNames: true,
    not: true,
    if: true,
    then: true,
    else: true
  };

  traverse$1.arrayKeywords = {
    items: true,
    allOf: true,
    anyOf: true,
    oneOf: true
  };

  traverse$1.propsKeywords = {
    $defs: true,
    definitions: true,
    properties: true,
    patternProperties: true,
    dependencies: true
  };

  traverse$1.skipKeywords = {
    default: true,
    enum: true,
    const: true,
    required: true,
    maximum: true,
    minimum: true,
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    multipleOf: true,
    maxLength: true,
    minLength: true,
    pattern: true,
    format: true,
    maxItems: true,
    minItems: true,
    uniqueItems: true,
    maxProperties: true,
    minProperties: true
  };


  function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
      pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      for (var key in schema) {
        var sch = schema[key];
        if (Array.isArray(sch)) {
          if (key in traverse$1.arrayKeywords) {
            for (var i=0; i<sch.length; i++)
              _traverse(opts, pre, post, sch[i], jsonPtr + '/' + key + '/' + i, rootSchema, jsonPtr, key, schema, i);
          }
        } else if (key in traverse$1.propsKeywords) {
          if (sch && typeof sch == 'object') {
            for (var prop in sch)
              _traverse(opts, pre, post, sch[prop], jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
          }
        } else if (key in traverse$1.keywords || (opts.allKeys && !(key in traverse$1.skipKeywords))) {
          _traverse(opts, pre, post, sch, jsonPtr + '/' + key, rootSchema, jsonPtr, key, schema);
        }
      }
      post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
    }
  }


  function escapeJsonPtr(str) {
    return str.replace(/~/g, '~0').replace(/\//g, '~1');
  }

  var uri_all = {exports: {}};

  /** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */

  (function (module, exports) {
  (function (global, factory) {
  	factory(exports) ;
  }(commonjsGlobal, (function (exports) {
  function merge() {
      for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
          sets[_key] = arguments[_key];
      }

      if (sets.length > 1) {
          sets[0] = sets[0].slice(0, -1);
          var xl = sets.length - 1;
          for (var x = 1; x < xl; ++x) {
              sets[x] = sets[x].slice(1, -1);
          }
          sets[xl] = sets[xl].slice(1);
          return sets.join('');
      } else {
          return sets[0];
      }
  }
  function subexp(str) {
      return "(?:" + str + ")";
  }
  function typeOf(o) {
      return o === undefined ? "undefined" : o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase();
  }
  function toUpperCase(str) {
      return str.toUpperCase();
  }
  function toArray(obj) {
      return obj !== undefined && obj !== null ? obj instanceof Array ? obj : typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj) : [];
  }
  function assign(target, source) {
      var obj = target;
      if (source) {
          for (var key in source) {
              obj[key] = source[key];
          }
      }
      return obj;
  }

  function buildExps(isIRI) {
      var ALPHA$$ = "[A-Za-z]",
          DIGIT$$ = "[0-9]",
          HEXDIG$$ = merge(DIGIT$$, "[A-Fa-f]"),
          PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$)),
          //expanded
      GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]",
          SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
          RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$),
          UCSCHAR$$ = isIRI ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]",
          //subset, excludes bidi control characters
      IPRIVATE$$ = isIRI ? "[\\uE000-\\uF8FF]" : "[]",
          //subset
      UNRESERVED$$ = merge(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]", UCSCHAR$$);
          subexp(ALPHA$$ + merge(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*");
          subexp(subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\:]")) + "*");
          var DEC_OCTET_RELAXED$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("0?[1-9]" + DIGIT$$) + "|0?0?" + DIGIT$$),
          //relaxed parsing rules
      IPV4ADDRESS$ = subexp(DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$),
          H16$ = subexp(HEXDIG$$ + "{1,4}"),
          LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$),
          IPV6ADDRESS1$ = subexp(subexp(H16$ + "\\:") + "{6}" + LS32$),
          //                           6( h16 ":" ) ls32
      IPV6ADDRESS2$ = subexp("\\:\\:" + subexp(H16$ + "\\:") + "{5}" + LS32$),
          //                      "::" 5( h16 ":" ) ls32
      IPV6ADDRESS3$ = subexp(subexp(H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{4}" + LS32$),
          //[               h16 ] "::" 4( h16 ":" ) ls32
      IPV6ADDRESS4$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,1}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{3}" + LS32$),
          //[ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
      IPV6ADDRESS5$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,2}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{2}" + LS32$),
          //[ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
      IPV6ADDRESS6$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,3}" + H16$) + "?\\:\\:" + H16$ + "\\:" + LS32$),
          //[ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
      IPV6ADDRESS7$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,4}" + H16$) + "?\\:\\:" + LS32$),
          //[ *4( h16 ":" ) h16 ] "::"              ls32
      IPV6ADDRESS8$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,5}" + H16$) + "?\\:\\:" + H16$),
          //[ *5( h16 ":" ) h16 ] "::"              h16
      IPV6ADDRESS9$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,6}" + H16$) + "?\\:\\:"),
          //[ *6( h16 ":" ) h16 ] "::"
      IPV6ADDRESS$ = subexp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join("|")),
          ZONEID$ = subexp(subexp(UNRESERVED$$ + "|" + PCT_ENCODED$) + "+");
          //RFC 6874, with relaxed parsing rules
      subexp("[vV]" + HEXDIG$$ + "+\\." + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\:]") + "+");
          //RFC 6874
      subexp(subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$)) + "*");
          var PCHAR$ = subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@]"));
          subexp(subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\@]")) + "+");
          subexp(subexp(PCHAR$ + "|" + merge("[\\/\\?]", IPRIVATE$$)) + "*");
      return {
          NOT_SCHEME: new RegExp(merge("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(merge("[^\\%\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
          NOT_HOST: new RegExp(merge("[^\\%\\[\\]\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
          NOT_PATH: new RegExp(merge("[^\\%\\/\\:\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
          NOT_PATH_NOSCHEME: new RegExp(merge("[^\\%\\/\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
          NOT_QUERY: new RegExp(merge("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]", IPRIVATE$$), "g"),
          NOT_FRAGMENT: new RegExp(merge("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(merge("[^]", UNRESERVED$$, SUB_DELIMS$$), "g"),
          UNRESERVED: new RegExp(UNRESERVED$$, "g"),
          OTHER_CHARS: new RegExp(merge("[^\\%]", UNRESERVED$$, RESERVED$$), "g"),
          PCT_ENCODED: new RegExp(PCT_ENCODED$, "g"),
          IPV4ADDRESS: new RegExp("^(" + IPV4ADDRESS$ + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + IPV6ADDRESS$ + ")" + subexp(subexp("\\%25|\\%(?!" + HEXDIG$$ + "{2})") + "(" + ZONEID$ + ")") + "?\\]?$") //RFC 6874, with relaxed parsing rules
      };
  }
  var URI_PROTOCOL = buildExps(false);

  var IRI_PROTOCOL = buildExps(true);

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();













  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /** Highest positive signed 32-bit float value */

  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

  /** Bootstring parameters */
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'

  /** Regular expressions */
  var regexPunycode = /^xn--/;
  var regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
  var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

  /** Error messages */
  var errors = {
  	'overflow': 'Overflow: input needs wider integers to process',
  	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  	'invalid-input': 'Invalid input'
  };

  /** Convenience shortcuts */
  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;

  /*--------------------------------------------------------------------------*/

  /**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */
  function error$1(type) {
  	throw new RangeError(errors[type]);
  }

  /**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */
  function map(array, fn) {
  	var result = [];
  	var length = array.length;
  	while (length--) {
  		result[length] = fn(array[length]);
  	}
  	return result;
  }

  /**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */
  function mapDomain(string, fn) {
  	var parts = string.split('@');
  	var result = '';
  	if (parts.length > 1) {
  		// In email addresses, only the domain name should be punycoded. Leave
  		// the local part (i.e. everything up to `@`) intact.
  		result = parts[0] + '@';
  		string = parts[1];
  	}
  	// Avoid `split(regex)` for IE8 compatibility. See #17.
  	string = string.replace(regexSeparators, '\x2E');
  	var labels = string.split('.');
  	var encoded = map(labels, fn).join('.');
  	return result + encoded;
  }

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */
  function ucs2decode(string) {
  	var output = [];
  	var counter = 0;
  	var length = string.length;
  	while (counter < length) {
  		var value = string.charCodeAt(counter++);
  		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
  			// It's a high surrogate, and there is a next character.
  			var extra = string.charCodeAt(counter++);
  			if ((extra & 0xFC00) == 0xDC00) {
  				// Low surrogate.
  				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
  			} else {
  				// It's an unmatched surrogate; only append this code unit, in case the
  				// next code unit is the high surrogate of a surrogate pair.
  				output.push(value);
  				counter--;
  			}
  		} else {
  			output.push(value);
  		}
  	}
  	return output;
  }

  /**
   * Creates a string based on an array of numeric code points.
   * @see `punycode.ucs2.decode`
   * @memberOf punycode.ucs2
   * @name encode
   * @param {Array} codePoints The array of numeric code points.
   * @returns {String} The new Unicode string (UCS-2).
   */
  var ucs2encode = function ucs2encode(array) {
  	return String.fromCodePoint.apply(String, toConsumableArray(array));
  };

  /**
   * Converts a basic code point into a digit/integer.
   * @see `digitToBasic()`
   * @private
   * @param {Number} codePoint The basic numeric code point value.
   * @returns {Number} The numeric value of a basic code point (for use in
   * representing integers) in the range `0` to `base - 1`, or `base` if
   * the code point does not represent a value.
   */
  var basicToDigit = function basicToDigit(codePoint) {
  	if (codePoint - 0x30 < 0x0A) {
  		return codePoint - 0x16;
  	}
  	if (codePoint - 0x41 < 0x1A) {
  		return codePoint - 0x41;
  	}
  	if (codePoint - 0x61 < 0x1A) {
  		return codePoint - 0x61;
  	}
  	return base;
  };

  /**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */
  var digitToBasic = function digitToBasic(digit, flag) {
  	//  0..25 map to ASCII a..z or A..Z
  	// 26..35 map to ASCII 0..9
  	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */
  var adapt = function adapt(delta, numPoints, firstTime) {
  	var k = 0;
  	delta = firstTime ? floor(delta / damp) : delta >> 1;
  	delta += floor(delta / numPoints);
  	for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
  		delta = floor(delta / baseMinusTMin);
  	}
  	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a Punycode string of ASCII-only symbols to a string of Unicode
   * symbols.
   * @memberOf punycode
   * @param {String} input The Punycode string of ASCII-only symbols.
   * @returns {String} The resulting string of Unicode symbols.
   */
  var decode = function decode(input) {
  	// Don't use UCS-2.
  	var output = [];
  	var inputLength = input.length;
  	var i = 0;
  	var n = initialN;
  	var bias = initialBias;

  	// Handle the basic code points: let `basic` be the number of input code
  	// points before the last delimiter, or `0` if there is none, then copy
  	// the first basic code points to the output.

  	var basic = input.lastIndexOf(delimiter);
  	if (basic < 0) {
  		basic = 0;
  	}

  	for (var j = 0; j < basic; ++j) {
  		// if it's not a basic code point
  		if (input.charCodeAt(j) >= 0x80) {
  			error$1('not-basic');
  		}
  		output.push(input.charCodeAt(j));
  	}

  	// Main decoding loop: start just after the last delimiter if any basic code
  	// points were copied; start at the beginning otherwise.

  	for (var index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

  		// `index` is the index of the next character to be consumed.
  		// Decode a generalized variable-length integer into `delta`,
  		// which gets added to `i`. The overflow checking is easier
  		// if we increase `i` as we go, then subtract off its starting
  		// value at the end to obtain `delta`.
  		var oldi = i;
  		for (var w = 1, k = base;; /* no condition */k += base) {

  			if (index >= inputLength) {
  				error$1('invalid-input');
  			}

  			var digit = basicToDigit(input.charCodeAt(index++));

  			if (digit >= base || digit > floor((maxInt - i) / w)) {
  				error$1('overflow');
  			}

  			i += digit * w;
  			var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

  			if (digit < t) {
  				break;
  			}

  			var baseMinusT = base - t;
  			if (w > floor(maxInt / baseMinusT)) {
  				error$1('overflow');
  			}

  			w *= baseMinusT;
  		}

  		var out = output.length + 1;
  		bias = adapt(i - oldi, out, oldi == 0);

  		// `i` was supposed to wrap around from `out` to `0`,
  		// incrementing `n` each time, so we'll fix that now:
  		if (floor(i / out) > maxInt - n) {
  			error$1('overflow');
  		}

  		n += floor(i / out);
  		i %= out;

  		// Insert `n` at position `i` of the output.
  		output.splice(i++, 0, n);
  	}

  	return String.fromCodePoint.apply(String, output);
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */
  var encode = function encode(input) {
  	var output = [];

  	// Convert the input in UCS-2 to an array of Unicode code points.
  	input = ucs2decode(input);

  	// Cache the length.
  	var inputLength = input.length;

  	// Initialize the state.
  	var n = initialN;
  	var delta = 0;
  	var bias = initialBias;

  	// Handle the basic code points.
  	var _iteratorNormalCompletion = true;
  	var _didIteratorError = false;
  	var _iteratorError = undefined;

  	try {
  		for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  			var _currentValue2 = _step.value;

  			if (_currentValue2 < 0x80) {
  				output.push(stringFromCharCode(_currentValue2));
  			}
  		}
  	} catch (err) {
  		_didIteratorError = true;
  		_iteratorError = err;
  	} finally {
  		try {
  			if (!_iteratorNormalCompletion && _iterator.return) {
  				_iterator.return();
  			}
  		} finally {
  			if (_didIteratorError) {
  				throw _iteratorError;
  			}
  		}
  	}

  	var basicLength = output.length;
  	var handledCPCount = basicLength;

  	// `handledCPCount` is the number of code points that have been handled;
  	// `basicLength` is the number of basic code points.

  	// Finish the basic string with a delimiter unless it's empty.
  	if (basicLength) {
  		output.push(delimiter);
  	}

  	// Main encoding loop:
  	while (handledCPCount < inputLength) {

  		// All non-basic code points < n have been handled already. Find the next
  		// larger one:
  		var m = maxInt;
  		var _iteratorNormalCompletion2 = true;
  		var _didIteratorError2 = false;
  		var _iteratorError2 = undefined;

  		try {
  			for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
  				var currentValue = _step2.value;

  				if (currentValue >= n && currentValue < m) {
  					m = currentValue;
  				}
  			}

  			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
  			// but guard against overflow.
  		} catch (err) {
  			_didIteratorError2 = true;
  			_iteratorError2 = err;
  		} finally {
  			try {
  				if (!_iteratorNormalCompletion2 && _iterator2.return) {
  					_iterator2.return();
  				}
  			} finally {
  				if (_didIteratorError2) {
  					throw _iteratorError2;
  				}
  			}
  		}

  		var handledCPCountPlusOne = handledCPCount + 1;
  		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
  			error$1('overflow');
  		}

  		delta += (m - n) * handledCPCountPlusOne;
  		n = m;

  		var _iteratorNormalCompletion3 = true;
  		var _didIteratorError3 = false;
  		var _iteratorError3 = undefined;

  		try {
  			for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
  				var _currentValue = _step3.value;

  				if (_currentValue < n && ++delta > maxInt) {
  					error$1('overflow');
  				}
  				if (_currentValue == n) {
  					// Represent delta as a generalized variable-length integer.
  					var q = delta;
  					for (var k = base;; /* no condition */k += base) {
  						var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
  						if (q < t) {
  							break;
  						}
  						var qMinusT = q - t;
  						var baseMinusT = base - t;
  						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
  						q = floor(qMinusT / baseMinusT);
  					}

  					output.push(stringFromCharCode(digitToBasic(q, 0)));
  					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
  					delta = 0;
  					++handledCPCount;
  				}
  			}
  		} catch (err) {
  			_didIteratorError3 = true;
  			_iteratorError3 = err;
  		} finally {
  			try {
  				if (!_iteratorNormalCompletion3 && _iterator3.return) {
  					_iterator3.return();
  				}
  			} finally {
  				if (_didIteratorError3) {
  					throw _iteratorError3;
  				}
  			}
  		}

  		++delta;
  		++n;
  	}
  	return output.join('');
  };

  /**
   * Converts a Punycode string representing a domain name or an email address
   * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
   * it doesn't matter if you call it on a string that has already been
   * converted to Unicode.
   * @memberOf punycode
   * @param {String} input The Punycoded domain name or email address to
   * convert to Unicode.
   * @returns {String} The Unicode representation of the given Punycode
   * string.
   */
  var toUnicode = function toUnicode(input) {
  	return mapDomain(input, function (string) {
  		return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
  	});
  };

  /**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */
  var toASCII = function toASCII(input) {
  	return mapDomain(input, function (string) {
  		return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
  	});
  };

  /*--------------------------------------------------------------------------*/

  /** Define the public API */
  var punycode = {
  	/**
    * A string representing the current Punycode.js version number.
    * @memberOf punycode
    * @type String
    */
  	'version': '2.1.0',
  	/**
    * An object of methods to convert from JavaScript's internal character
    * representation (UCS-2) to Unicode code points, and back.
    * @see <https://mathiasbynens.be/notes/javascript-encoding>
    * @memberOf punycode
    * @type Object
    */
  	'ucs2': {
  		'decode': ucs2decode,
  		'encode': ucs2encode
  	},
  	'decode': decode,
  	'encode': encode,
  	'toASCII': toASCII,
  	'toUnicode': toUnicode
  };

  /**
   * URI.js
   *
   * @fileoverview An RFC 3986 compliant, scheme extendable URI parsing/validating/resolving library for JavaScript.
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/uri-js
   */
  /**
   * Copyright 2011 Gary Court. All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without modification, are
   * permitted provided that the following conditions are met:
   *
   *    1. Redistributions of source code must retain the above copyright notice, this list of
   *       conditions and the following disclaimer.
   *
   *    2. Redistributions in binary form must reproduce the above copyright notice, this list
   *       of conditions and the following disclaimer in the documentation and/or other materials
   *       provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
   * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
   * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
   * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   * The views and conclusions contained in the software and documentation are those of the
   * authors and should not be interpreted as representing official policies, either expressed
   * or implied, of Gary Court.
   */
  var SCHEMES = {};
  function pctEncChar(chr) {
      var c = chr.charCodeAt(0);
      var e = void 0;
      if (c < 16) e = "%0" + c.toString(16).toUpperCase();else if (c < 128) e = "%" + c.toString(16).toUpperCase();else if (c < 2048) e = "%" + (c >> 6 | 192).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();else e = "%" + (c >> 12 | 224).toString(16).toUpperCase() + "%" + (c >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();
      return e;
  }
  function pctDecChars(str) {
      var newStr = "";
      var i = 0;
      var il = str.length;
      while (i < il) {
          var c = parseInt(str.substr(i + 1, 2), 16);
          if (c < 128) {
              newStr += String.fromCharCode(c);
              i += 3;
          } else if (c >= 194 && c < 224) {
              if (il - i >= 6) {
                  var c2 = parseInt(str.substr(i + 4, 2), 16);
                  newStr += String.fromCharCode((c & 31) << 6 | c2 & 63);
              } else {
                  newStr += str.substr(i, 6);
              }
              i += 6;
          } else if (c >= 224) {
              if (il - i >= 9) {
                  var _c = parseInt(str.substr(i + 4, 2), 16);
                  var c3 = parseInt(str.substr(i + 7, 2), 16);
                  newStr += String.fromCharCode((c & 15) << 12 | (_c & 63) << 6 | c3 & 63);
              } else {
                  newStr += str.substr(i, 9);
              }
              i += 9;
          } else {
              newStr += str.substr(i, 3);
              i += 3;
          }
      }
      return newStr;
  }
  function _normalizeComponentEncoding(components, protocol) {
      function decodeUnreserved(str) {
          var decStr = pctDecChars(str);
          return !decStr.match(protocol.UNRESERVED) ? str : decStr;
      }
      if (components.scheme) components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_SCHEME, "");
      if (components.userinfo !== undefined) components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
      if (components.host !== undefined) components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
      if (components.path !== undefined) components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
      if (components.query !== undefined) components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
      if (components.fragment !== undefined) components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
      return components;
  }

  function _stripLeadingZeros(str) {
      return str.replace(/^0*(.*)/, "$1") || "0";
  }
  function _normalizeIPv4(host, protocol) {
      var matches = host.match(protocol.IPV4ADDRESS) || [];

      var _matches = slicedToArray(matches, 2),
          address = _matches[1];

      if (address) {
          return address.split(".").map(_stripLeadingZeros).join(".");
      } else {
          return host;
      }
  }
  function _normalizeIPv6(host, protocol) {
      var matches = host.match(protocol.IPV6ADDRESS) || [];

      var _matches2 = slicedToArray(matches, 3),
          address = _matches2[1],
          zone = _matches2[2];

      if (address) {
          var _address$toLowerCase$ = address.toLowerCase().split('::').reverse(),
              _address$toLowerCase$2 = slicedToArray(_address$toLowerCase$, 2),
              last = _address$toLowerCase$2[0],
              first = _address$toLowerCase$2[1];

          var firstFields = first ? first.split(":").map(_stripLeadingZeros) : [];
          var lastFields = last.split(":").map(_stripLeadingZeros);
          var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]);
          var fieldCount = isLastFieldIPv4Address ? 7 : 8;
          var lastFieldsStart = lastFields.length - fieldCount;
          var fields = Array(fieldCount);
          for (var x = 0; x < fieldCount; ++x) {
              fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || '';
          }
          if (isLastFieldIPv4Address) {
              fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);
          }
          var allZeroFields = fields.reduce(function (acc, field, index) {
              if (!field || field === "0") {
                  var lastLongest = acc[acc.length - 1];
                  if (lastLongest && lastLongest.index + lastLongest.length === index) {
                      lastLongest.length++;
                  } else {
                      acc.push({ index: index, length: 1 });
                  }
              }
              return acc;
          }, []);
          var longestZeroFields = allZeroFields.sort(function (a, b) {
              return b.length - a.length;
          })[0];
          var newHost = void 0;
          if (longestZeroFields && longestZeroFields.length > 1) {
              var newFirst = fields.slice(0, longestZeroFields.index);
              var newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
              newHost = newFirst.join(":") + "::" + newLast.join(":");
          } else {
              newHost = fields.join(":");
          }
          if (zone) {
              newHost += "%" + zone;
          }
          return newHost;
      } else {
          return host;
      }
  }
  var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
  var NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === undefined;
  function parse(uriString) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var components = {};
      var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
      if (options.reference === "suffix") uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
      var matches = uriString.match(URI_PARSE);
      if (matches) {
          if (NO_MATCH_IS_UNDEFINED) {
              //store each component
              components.scheme = matches[1];
              components.userinfo = matches[3];
              components.host = matches[4];
              components.port = parseInt(matches[5], 10);
              components.path = matches[6] || "";
              components.query = matches[7];
              components.fragment = matches[8];
              //fix port number
              if (isNaN(components.port)) {
                  components.port = matches[5];
              }
          } else {
              //IE FIX for improper RegExp matching
              //store each component
              components.scheme = matches[1] || undefined;
              components.userinfo = uriString.indexOf("@") !== -1 ? matches[3] : undefined;
              components.host = uriString.indexOf("//") !== -1 ? matches[4] : undefined;
              components.port = parseInt(matches[5], 10);
              components.path = matches[6] || "";
              components.query = uriString.indexOf("?") !== -1 ? matches[7] : undefined;
              components.fragment = uriString.indexOf("#") !== -1 ? matches[8] : undefined;
              //fix port number
              if (isNaN(components.port)) {
                  components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : undefined;
              }
          }
          if (components.host) {
              //normalize IP hosts
              components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);
          }
          //determine reference type
          if (components.scheme === undefined && components.userinfo === undefined && components.host === undefined && components.port === undefined && !components.path && components.query === undefined) {
              components.reference = "same-document";
          } else if (components.scheme === undefined) {
              components.reference = "relative";
          } else if (components.fragment === undefined) {
              components.reference = "absolute";
          } else {
              components.reference = "uri";
          }
          //check for reference errors
          if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
              components.error = components.error || "URI is not a " + options.reference + " reference.";
          }
          //find scheme handler
          var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
          //check if scheme can't handle IRIs
          if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
              //if host component is a domain name
              if (components.host && (options.domainHost || schemeHandler && schemeHandler.domainHost)) {
                  //convert Unicode IDN -> ASCII IDN
                  try {
                      components.host = punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
                  } catch (e) {
                      components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
                  }
              }
              //convert IRI -> URI
              _normalizeComponentEncoding(components, URI_PROTOCOL);
          } else {
              //normalize encodings
              _normalizeComponentEncoding(components, protocol);
          }
          //perform scheme specific parsing
          if (schemeHandler && schemeHandler.parse) {
              schemeHandler.parse(components, options);
          }
      } else {
          components.error = components.error || "URI can not be parsed.";
      }
      return components;
  }

  function _recomposeAuthority(components, options) {
      var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
      var uriTokens = [];
      if (components.userinfo !== undefined) {
          uriTokens.push(components.userinfo);
          uriTokens.push("@");
      }
      if (components.host !== undefined) {
          //normalize IP hosts, add brackets and escape zone separator for IPv6
          uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function (_, $1, $2) {
              return "[" + $1 + ($2 ? "%25" + $2 : "") + "]";
          }));
      }
      if (typeof components.port === "number" || typeof components.port === "string") {
          uriTokens.push(":");
          uriTokens.push(String(components.port));
      }
      return uriTokens.length ? uriTokens.join("") : undefined;
  }

  var RDS1 = /^\.\.?\//;
  var RDS2 = /^\/\.(\/|$)/;
  var RDS3 = /^\/\.\.(\/|$)/;
  var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
  function removeDotSegments(input) {
      var output = [];
      while (input.length) {
          if (input.match(RDS1)) {
              input = input.replace(RDS1, "");
          } else if (input.match(RDS2)) {
              input = input.replace(RDS2, "/");
          } else if (input.match(RDS3)) {
              input = input.replace(RDS3, "/");
              output.pop();
          } else if (input === "." || input === "..") {
              input = "";
          } else {
              var im = input.match(RDS5);
              if (im) {
                  var s = im[0];
                  input = input.slice(s.length);
                  output.push(s);
              } else {
                  throw new Error("Unexpected dot segment condition");
              }
          }
      }
      return output.join("");
  }

  function serialize(components) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var protocol = options.iri ? IRI_PROTOCOL : URI_PROTOCOL;
      var uriTokens = [];
      //find scheme handler
      var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
      //perform scheme specific serialization
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(components, options);
      if (components.host) {
          //if host component is an IPv6 address
          if (protocol.IPV6ADDRESS.test(components.host)) ;
          //TODO: normalize IPv6 address as per RFC 5952

          //if host component is a domain name
          else if (options.domainHost || schemeHandler && schemeHandler.domainHost) {
                  //convert IDN via punycode
                  try {
                      components.host = !options.iri ? punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode.toUnicode(components.host);
                  } catch (e) {
                      components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
                  }
              }
      }
      //normalize encoding
      _normalizeComponentEncoding(components, protocol);
      if (options.reference !== "suffix" && components.scheme) {
          uriTokens.push(components.scheme);
          uriTokens.push(":");
      }
      var authority = _recomposeAuthority(components, options);
      if (authority !== undefined) {
          if (options.reference !== "suffix") {
              uriTokens.push("//");
          }
          uriTokens.push(authority);
          if (components.path && components.path.charAt(0) !== "/") {
              uriTokens.push("/");
          }
      }
      if (components.path !== undefined) {
          var s = components.path;
          if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
              s = removeDotSegments(s);
          }
          if (authority === undefined) {
              s = s.replace(/^\/\//, "/%2F"); //don't allow the path to start with "//"
          }
          uriTokens.push(s);
      }
      if (components.query !== undefined) {
          uriTokens.push("?");
          uriTokens.push(components.query);
      }
      if (components.fragment !== undefined) {
          uriTokens.push("#");
          uriTokens.push(components.fragment);
      }
      return uriTokens.join(""); //merge tokens into a string
  }

  function resolveComponents(base, relative) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var skipNormalization = arguments[3];

      var target = {};
      if (!skipNormalization) {
          base = parse(serialize(base, options), options); //normalize base components
          relative = parse(serialize(relative, options), options); //normalize relative components
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
          target.scheme = relative.scheme;
          //target.authority = relative.authority;
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
      } else {
          if (relative.userinfo !== undefined || relative.host !== undefined || relative.port !== undefined) {
              //target.authority = relative.authority;
              target.userinfo = relative.userinfo;
              target.host = relative.host;
              target.port = relative.port;
              target.path = removeDotSegments(relative.path || "");
              target.query = relative.query;
          } else {
              if (!relative.path) {
                  target.path = base.path;
                  if (relative.query !== undefined) {
                      target.query = relative.query;
                  } else {
                      target.query = base.query;
                  }
              } else {
                  if (relative.path.charAt(0) === "/") {
                      target.path = removeDotSegments(relative.path);
                  } else {
                      if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
                          target.path = "/" + relative.path;
                      } else if (!base.path) {
                          target.path = relative.path;
                      } else {
                          target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
                      }
                      target.path = removeDotSegments(target.path);
                  }
                  target.query = relative.query;
              }
              //target.authority = base.authority;
              target.userinfo = base.userinfo;
              target.host = base.host;
              target.port = base.port;
          }
          target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
  }

  function resolve(baseURI, relativeURI, options) {
      var schemelessOptions = assign({ scheme: 'null' }, options);
      return serialize(resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
  }

  function normalize(uri, options) {
      if (typeof uri === "string") {
          uri = serialize(parse(uri, options), options);
      } else if (typeOf(uri) === "object") {
          uri = parse(serialize(uri, options), options);
      }
      return uri;
  }

  function equal(uriA, uriB, options) {
      if (typeof uriA === "string") {
          uriA = serialize(parse(uriA, options), options);
      } else if (typeOf(uriA) === "object") {
          uriA = serialize(uriA, options);
      }
      if (typeof uriB === "string") {
          uriB = serialize(parse(uriB, options), options);
      } else if (typeOf(uriB) === "object") {
          uriB = serialize(uriB, options);
      }
      return uriA === uriB;
  }

  function escapeComponent(str, options) {
      return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.ESCAPE : IRI_PROTOCOL.ESCAPE, pctEncChar);
  }

  function unescapeComponent(str, options) {
      return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.PCT_ENCODED : IRI_PROTOCOL.PCT_ENCODED, pctDecChars);
  }

  var handler = {
      scheme: "http",
      domainHost: true,
      parse: function parse(components, options) {
          //report missing host
          if (!components.host) {
              components.error = components.error || "HTTP URIs must have a host.";
          }
          return components;
      },
      serialize: function serialize(components, options) {
          var secure = String(components.scheme).toLowerCase() === "https";
          //normalize the default port
          if (components.port === (secure ? 443 : 80) || components.port === "") {
              components.port = undefined;
          }
          //normalize the empty path
          if (!components.path) {
              components.path = "/";
          }
          //NOTE: We do not parse query strings for HTTP URIs
          //as WWW Form Url Encoded query strings are part of the HTML4+ spec,
          //and not the HTTP spec.
          return components;
      }
  };

  var handler$1 = {
      scheme: "https",
      domainHost: handler.domainHost,
      parse: handler.parse,
      serialize: handler.serialize
  };

  function isSecure(wsComponents) {
      return typeof wsComponents.secure === 'boolean' ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
  }
  //RFC 6455
  var handler$2 = {
      scheme: "ws",
      domainHost: true,
      parse: function parse(components, options) {
          var wsComponents = components;
          //indicate if the secure flag is set
          wsComponents.secure = isSecure(wsComponents);
          //construct resouce name
          wsComponents.resourceName = (wsComponents.path || '/') + (wsComponents.query ? '?' + wsComponents.query : '');
          wsComponents.path = undefined;
          wsComponents.query = undefined;
          return wsComponents;
      },
      serialize: function serialize(wsComponents, options) {
          //normalize the default port
          if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") {
              wsComponents.port = undefined;
          }
          //ensure scheme matches secure flag
          if (typeof wsComponents.secure === 'boolean') {
              wsComponents.scheme = wsComponents.secure ? 'wss' : 'ws';
              wsComponents.secure = undefined;
          }
          //reconstruct path from resource name
          if (wsComponents.resourceName) {
              var _wsComponents$resourc = wsComponents.resourceName.split('?'),
                  _wsComponents$resourc2 = slicedToArray(_wsComponents$resourc, 2),
                  path = _wsComponents$resourc2[0],
                  query = _wsComponents$resourc2[1];

              wsComponents.path = path && path !== '/' ? path : undefined;
              wsComponents.query = query;
              wsComponents.resourceName = undefined;
          }
          //forbid fragment component
          wsComponents.fragment = undefined;
          return wsComponents;
      }
  };

  var handler$3 = {
      scheme: "wss",
      domainHost: handler$2.domainHost,
      parse: handler$2.parse,
      serialize: handler$2.serialize
  };

  var O = {};
  //RFC 3986
  var UNRESERVED$$ = "[A-Za-z0-9\\-\\.\\_\\~" + ("\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF" ) + "]";
  var HEXDIG$$ = "[0-9A-Fa-f]"; //case-insensitive
  var PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$)); //expanded
  //RFC 5322, except these symbols as per RFC 6068: @ : / ? # [ ] & ; =
  //const ATEXT$$ = "[A-Za-z0-9\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~]";
  //const WSP$$ = "[\\x20\\x09]";
  //const OBS_QTEXT$$ = "[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]";  //(%d1-8 / %d11-12 / %d14-31 / %d127)
  //const QTEXT$$ = merge("[\\x21\\x23-\\x5B\\x5D-\\x7E]", OBS_QTEXT$$);  //%d33 / %d35-91 / %d93-126 / obs-qtext
  //const VCHAR$$ = "[\\x21-\\x7E]";
  //const WSP$$ = "[\\x20\\x09]";
  //const OBS_QP$ = subexp("\\\\" + merge("[\\x00\\x0D\\x0A]", OBS_QTEXT$$));  //%d0 / CR / LF / obs-qtext
  //const FWS$ = subexp(subexp(WSP$$ + "*" + "\\x0D\\x0A") + "?" + WSP$$ + "+");
  //const QUOTED_PAIR$ = subexp(subexp("\\\\" + subexp(VCHAR$$ + "|" + WSP$$)) + "|" + OBS_QP$);
  //const QUOTED_STRING$ = subexp('\\"' + subexp(FWS$ + "?" + QCONTENT$) + "*" + FWS$ + "?" + '\\"');
  var ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]";
  var QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]";
  var VCHAR$$ = merge(QTEXT$$, "[\\\"\\\\]");
  var SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]";
  var UNRESERVED = new RegExp(UNRESERVED$$, "g");
  var PCT_ENCODED = new RegExp(PCT_ENCODED$, "g");
  var NOT_LOCAL_PART = new RegExp(merge("[^]", ATEXT$$, "[\\.]", '[\\"]', VCHAR$$), "g");
  var NOT_HFNAME = new RegExp(merge("[^]", UNRESERVED$$, SOME_DELIMS$$), "g");
  var NOT_HFVALUE = NOT_HFNAME;
  function decodeUnreserved(str) {
      var decStr = pctDecChars(str);
      return !decStr.match(UNRESERVED) ? str : decStr;
  }
  var handler$4 = {
      scheme: "mailto",
      parse: function parse$$1(components, options) {
          var mailtoComponents = components;
          var to = mailtoComponents.to = mailtoComponents.path ? mailtoComponents.path.split(",") : [];
          mailtoComponents.path = undefined;
          if (mailtoComponents.query) {
              var unknownHeaders = false;
              var headers = {};
              var hfields = mailtoComponents.query.split("&");
              for (var x = 0, xl = hfields.length; x < xl; ++x) {
                  var hfield = hfields[x].split("=");
                  switch (hfield[0]) {
                      case "to":
                          var toAddrs = hfield[1].split(",");
                          for (var _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) {
                              to.push(toAddrs[_x]);
                          }
                          break;
                      case "subject":
                          mailtoComponents.subject = unescapeComponent(hfield[1], options);
                          break;
                      case "body":
                          mailtoComponents.body = unescapeComponent(hfield[1], options);
                          break;
                      default:
                          unknownHeaders = true;
                          headers[unescapeComponent(hfield[0], options)] = unescapeComponent(hfield[1], options);
                          break;
                  }
              }
              if (unknownHeaders) mailtoComponents.headers = headers;
          }
          mailtoComponents.query = undefined;
          for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
              var addr = to[_x2].split("@");
              addr[0] = unescapeComponent(addr[0]);
              if (!options.unicodeSupport) {
                  //convert Unicode IDN -> ASCII IDN
                  try {
                      addr[1] = punycode.toASCII(unescapeComponent(addr[1], options).toLowerCase());
                  } catch (e) {
                      mailtoComponents.error = mailtoComponents.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
                  }
              } else {
                  addr[1] = unescapeComponent(addr[1], options).toLowerCase();
              }
              to[_x2] = addr.join("@");
          }
          return mailtoComponents;
      },
      serialize: function serialize$$1(mailtoComponents, options) {
          var components = mailtoComponents;
          var to = toArray(mailtoComponents.to);
          if (to) {
              for (var x = 0, xl = to.length; x < xl; ++x) {
                  var toAddr = String(to[x]);
                  var atIdx = toAddr.lastIndexOf("@");
                  var localPart = toAddr.slice(0, atIdx).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar);
                  var domain = toAddr.slice(atIdx + 1);
                  //convert IDN via punycode
                  try {
                      domain = !options.iri ? punycode.toASCII(unescapeComponent(domain, options).toLowerCase()) : punycode.toUnicode(domain);
                  } catch (e) {
                      components.error = components.error || "Email address's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
                  }
                  to[x] = localPart + "@" + domain;
              }
              components.path = to.join(",");
          }
          var headers = mailtoComponents.headers = mailtoComponents.headers || {};
          if (mailtoComponents.subject) headers["subject"] = mailtoComponents.subject;
          if (mailtoComponents.body) headers["body"] = mailtoComponents.body;
          var fields = [];
          for (var name in headers) {
              if (headers[name] !== O[name]) {
                  fields.push(name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar) + "=" + headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar));
              }
          }
          if (fields.length) {
              components.query = fields.join("&");
          }
          return components;
      }
  };

  var URN_PARSE = /^([^\:]+)\:(.*)/;
  //RFC 2141
  var handler$5 = {
      scheme: "urn",
      parse: function parse$$1(components, options) {
          var matches = components.path && components.path.match(URN_PARSE);
          var urnComponents = components;
          if (matches) {
              var scheme = options.scheme || urnComponents.scheme || "urn";
              var nid = matches[1].toLowerCase();
              var nss = matches[2];
              var urnScheme = scheme + ":" + (options.nid || nid);
              var schemeHandler = SCHEMES[urnScheme];
              urnComponents.nid = nid;
              urnComponents.nss = nss;
              urnComponents.path = undefined;
              if (schemeHandler) {
                  urnComponents = schemeHandler.parse(urnComponents, options);
              }
          } else {
              urnComponents.error = urnComponents.error || "URN can not be parsed.";
          }
          return urnComponents;
      },
      serialize: function serialize$$1(urnComponents, options) {
          var scheme = options.scheme || urnComponents.scheme || "urn";
          var nid = urnComponents.nid;
          var urnScheme = scheme + ":" + (options.nid || nid);
          var schemeHandler = SCHEMES[urnScheme];
          if (schemeHandler) {
              urnComponents = schemeHandler.serialize(urnComponents, options);
          }
          var uriComponents = urnComponents;
          var nss = urnComponents.nss;
          uriComponents.path = (nid || options.nid) + ":" + nss;
          return uriComponents;
      }
  };

  var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
  //RFC 4122
  var handler$6 = {
      scheme: "urn:uuid",
      parse: function parse(urnComponents, options) {
          var uuidComponents = urnComponents;
          uuidComponents.uuid = uuidComponents.nss;
          uuidComponents.nss = undefined;
          if (!options.tolerant && (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID))) {
              uuidComponents.error = uuidComponents.error || "UUID is not valid.";
          }
          return uuidComponents;
      },
      serialize: function serialize(uuidComponents, options) {
          var urnComponents = uuidComponents;
          //normalize UUID
          urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
          return urnComponents;
      }
  };

  SCHEMES[handler.scheme] = handler;
  SCHEMES[handler$1.scheme] = handler$1;
  SCHEMES[handler$2.scheme] = handler$2;
  SCHEMES[handler$3.scheme] = handler$3;
  SCHEMES[handler$4.scheme] = handler$4;
  SCHEMES[handler$5.scheme] = handler$5;
  SCHEMES[handler$6.scheme] = handler$6;

  exports.SCHEMES = SCHEMES;
  exports.pctEncChar = pctEncChar;
  exports.pctDecChars = pctDecChars;
  exports.parse = parse;
  exports.removeDotSegments = removeDotSegments;
  exports.serialize = serialize;
  exports.resolveComponents = resolveComponents;
  exports.resolve = resolve;
  exports.normalize = normalize;
  exports.equal = equal;
  exports.escapeComponent = escapeComponent;
  exports.unescapeComponent = unescapeComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

  })));

  }(uri_all, uri_all.exports));

  Object.defineProperty(resolve$1, "__esModule", { value: true });
  resolve$1.getSchemaRefs = resolve$1.resolveUrl = resolve$1.normalizeId = resolve$1._getFullPath = resolve$1.getFullPath = resolve$1.inlineRef = void 0;
  const util_1$l = util;
  const equal$2 = fastDeepEqual;
  const traverse = jsonSchemaTraverse.exports;
  const URI$1 = uri_all.exports;
  // TODO refactor to use keyword definitions
  const SIMPLE_INLINED = new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const",
  ]);
  function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
          return true;
      if (limit === true)
          return !hasRef(schema);
      if (!limit)
          return false;
      return countKeys(schema) <= limit;
  }
  resolve$1.inlineRef = inlineRef;
  const REF_KEYWORDS = new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor",
  ]);
  function hasRef(schema) {
      for (const key in schema) {
          if (REF_KEYWORDS.has(key))
              return true;
          const sch = schema[key];
          if (Array.isArray(sch) && sch.some(hasRef))
              return true;
          if (typeof sch == "object" && hasRef(sch))
              return true;
      }
      return false;
  }
  function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
          if (key === "$ref")
              return Infinity;
          count++;
          if (SIMPLE_INLINED.has(key))
              continue;
          if (typeof schema[key] == "object") {
              util_1$l.eachItem(schema[key], (sch) => (count += countKeys(sch)));
          }
          if (count === Infinity)
              return Infinity;
      }
      return count;
  }
  function getFullPath(id = "", normalize) {
      if (normalize !== false)
          id = normalizeId(id);
      const p = URI$1.parse(id);
      return _getFullPath(p);
  }
  resolve$1.getFullPath = getFullPath;
  function _getFullPath(p) {
      return URI$1.serialize(p).split("#")[0] + "#";
  }
  resolve$1._getFullPath = _getFullPath;
  const TRAILING_SLASH_HASH = /#\/?$/;
  function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
  }
  resolve$1.normalizeId = normalizeId;
  function resolveUrl(baseId, id) {
      id = normalizeId(id);
      return URI$1.resolve(baseId, id);
  }
  resolve$1.resolveUrl = resolveUrl;
  const ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
  function getSchemaRefs(schema) {
      if (typeof schema == "boolean")
          return {};
      const { schemaId } = this.opts;
      const schId = normalizeId(schema[schemaId]);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(schId, false);
      const localRefs = {};
      const schemaRefs = new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
          if (parentJsonPtr === undefined)
              return;
          const fullPath = pathPrefix + jsonPtr;
          let baseId = baseIds[parentJsonPtr];
          if (typeof sch[schemaId] == "string")
              baseId = addRef.call(this, sch[schemaId]);
          addAnchor.call(this, sch.$anchor);
          addAnchor.call(this, sch.$dynamicAnchor);
          baseIds[jsonPtr] = baseId;
          function addRef(ref) {
              ref = normalizeId(baseId ? URI$1.resolve(baseId, ref) : ref);
              if (schemaRefs.has(ref))
                  throw ambiguos(ref);
              schemaRefs.add(ref);
              let schOrRef = this.refs[ref];
              if (typeof schOrRef == "string")
                  schOrRef = this.refs[schOrRef];
              if (typeof schOrRef == "object") {
                  checkAmbiguosRef(sch, schOrRef.schema, ref);
              }
              else if (ref !== normalizeId(fullPath)) {
                  if (ref[0] === "#") {
                      checkAmbiguosRef(sch, localRefs[ref], ref);
                      localRefs[ref] = sch;
                  }
                  else {
                      this.refs[ref] = fullPath;
                  }
              }
              return ref;
          }
          function addAnchor(anchor) {
              if (typeof anchor == "string") {
                  if (!ANCHOR.test(anchor))
                      throw new Error(`invalid anchor "${anchor}"`);
                  addRef.call(this, `#${anchor}`);
              }
          }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
          if (sch2 !== undefined && !equal$2(sch1, sch2))
              throw ambiguos(ref);
      }
      function ambiguos(ref) {
          return new Error(`reference "${ref}" resolves to more than one schema`);
      }
  }
  resolve$1.getSchemaRefs = getSchemaRefs;

  Object.defineProperty(validate$1, "__esModule", { value: true });
  validate$1.getData = validate$1.KeywordCxt = validate$1.validateFunctionCode = void 0;
  const boolSchema_1 = boolSchema;
  const dataType_1$1 = dataType;
  const applicability_1 = applicability;
  const dataType_2 = dataType;
  const defaults_1 = defaults;
  const keyword_1 = keyword;
  const subschema_1 = subschema;
  const codegen_1$n = codegen;
  const names_1$3 = names$1;
  const resolve_1$2 = resolve$1;
  const util_1$k = util;
  const errors_1 = errors$1;
  // schema compilation - generates validation function, subschemaCode (below) is used for subschemas
  function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
          checkKeywords(it);
          if (schemaCxtHasRules(it)) {
              topSchemaObjCode(it);
              return;
          }
      }
      validateFunction(it, () => boolSchema_1.topBoolOrEmptySchema(it));
  }
  validate$1.validateFunctionCode = validateFunctionCode;
  function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
          gen.func(validateName, codegen_1$n._ `${names_1$3.default.data}, ${names_1$3.default.valCxt}`, schemaEnv.$async, () => {
              gen.code(codegen_1$n._ `"use strict"; ${funcSourceUrl(schema, opts)}`);
              destructureValCxtES5(gen, opts);
              gen.code(body);
          });
      }
      else {
          gen.func(validateName, codegen_1$n._ `${names_1$3.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
  }
  function destructureValCxt(opts) {
      return codegen_1$n._ `{${names_1$3.default.instancePath}="", ${names_1$3.default.parentData}, ${names_1$3.default.parentDataProperty}, ${names_1$3.default.rootData}=${names_1$3.default.data}${opts.dynamicRef ? codegen_1$n._ `, ${names_1$3.default.dynamicAnchors}={}` : codegen_1$n.nil}}={}`;
  }
  function destructureValCxtES5(gen, opts) {
      gen.if(names_1$3.default.valCxt, () => {
          gen.var(names_1$3.default.instancePath, codegen_1$n._ `${names_1$3.default.valCxt}.${names_1$3.default.instancePath}`);
          gen.var(names_1$3.default.parentData, codegen_1$n._ `${names_1$3.default.valCxt}.${names_1$3.default.parentData}`);
          gen.var(names_1$3.default.parentDataProperty, codegen_1$n._ `${names_1$3.default.valCxt}.${names_1$3.default.parentDataProperty}`);
          gen.var(names_1$3.default.rootData, codegen_1$n._ `${names_1$3.default.valCxt}.${names_1$3.default.rootData}`);
          if (opts.dynamicRef)
              gen.var(names_1$3.default.dynamicAnchors, codegen_1$n._ `${names_1$3.default.valCxt}.${names_1$3.default.dynamicAnchors}`);
      }, () => {
          gen.var(names_1$3.default.instancePath, codegen_1$n._ `""`);
          gen.var(names_1$3.default.parentData, codegen_1$n._ `undefined`);
          gen.var(names_1$3.default.parentDataProperty, codegen_1$n._ `undefined`);
          gen.var(names_1$3.default.rootData, names_1$3.default.data);
          if (opts.dynamicRef)
              gen.var(names_1$3.default.dynamicAnchors, codegen_1$n._ `{}`);
      });
  }
  function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
          if (opts.$comment && schema.$comment)
              commentKeyword(it);
          checkNoDefault(it);
          gen.let(names_1$3.default.vErrors, null);
          gen.let(names_1$3.default.errors, 0);
          if (opts.unevaluated)
              resetEvaluated(it);
          typeAndKeywords(it);
          returnResults(it);
      });
      return;
  }
  function resetEvaluated(it) {
      // TODO maybe some hook to execute it in the end to check whether props/items are Name, as in assignEvaluated
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", codegen_1$n._ `${validateName}.evaluated`);
      gen.if(codegen_1$n._ `${it.evaluated}.dynamicProps`, () => gen.assign(codegen_1$n._ `${it.evaluated}.props`, codegen_1$n._ `undefined`));
      gen.if(codegen_1$n._ `${it.evaluated}.dynamicItems`, () => gen.assign(codegen_1$n._ `${it.evaluated}.items`, codegen_1$n._ `undefined`));
  }
  function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? codegen_1$n._ `/*# sourceURL=${schId} */` : codegen_1$n.nil;
  }
  // schema compilation - this function is used recursively to generate code for sub-schemas
  function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
          checkKeywords(it);
          if (schemaCxtHasRules(it)) {
              subSchemaObjCode(it, valid);
              return;
          }
      }
      boolSchema_1.boolOrEmptySchema(it, valid);
  }
  function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
          return !schema;
      for (const key in schema)
          if (self.RULES.all[key])
              return true;
      return false;
  }
  function isSchemaObj(it) {
      return typeof it.schema != "boolean";
  }
  function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
          commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1$3.default.errors);
      typeAndKeywords(it, errsCount);
      // TODO var
      gen.var(valid, codegen_1$n._ `${errsCount} === ${names_1$3.default.errors}`);
  }
  function checkKeywords(it) {
      util_1$k.checkUnknownRules(it);
      checkRefsAndKeywords(it);
  }
  function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
          return schemaKeywords(it, [], false, errsCount);
      const types = dataType_1$1.getSchemaTypes(it.schema);
      const checkedTypes = dataType_1$1.coerceAndCheckDataType(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
  }
  function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && util_1$k.schemaHasRulesButRef(schema, self.RULES)) {
          self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
  }
  function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== undefined && opts.useDefaults && opts.strictSchema) {
          util_1$k.checkStrictMode(it, "default is ignored in the schema root");
      }
  }
  function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
          it.baseId = resolve_1$2.resolveUrl(it.baseId, schId);
  }
  function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
          throw new Error("async schema in sync schema");
  }
  function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
          gen.code(codegen_1$n._ `${names_1$3.default.self}.logger.log(${msg})`);
      }
      else if (typeof opts.$comment == "function") {
          const schemaPath = codegen_1$n.str `${errSchemaPath}/$comment`;
          const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
          gen.code(codegen_1$n._ `${names_1$3.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
  }
  function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
          // TODO assign unevaluated
          gen.if(codegen_1$n._ `${names_1$3.default.errors} === 0`, () => gen.return(names_1$3.default.data), () => gen.throw(codegen_1$n._ `new ${ValidationError}(${names_1$3.default.vErrors})`));
      }
      else {
          gen.assign(codegen_1$n._ `${validateName}.errors`, names_1$3.default.vErrors);
          if (opts.unevaluated)
              assignEvaluated(it);
          gen.return(codegen_1$n._ `${names_1$3.default.errors} === 0`);
      }
  }
  function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1$n.Name)
          gen.assign(codegen_1$n._ `${evaluated}.props`, props);
      if (items instanceof codegen_1$n.Name)
          gen.assign(codegen_1$n._ `${evaluated}.items`, items);
  }
  function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !util_1$k.schemaHasRulesButRef(schema, RULES))) {
          gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition)); // TODO typecast
          return;
      }
      if (!opts.jtd)
          checkStrictTypes(it, types);
      gen.block(() => {
          for (const group of RULES.rules)
              groupKeywords(group);
          groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
          if (!applicability_1.shouldUseGroup(schema, group))
              return;
          if (group.type) {
              gen.if(dataType_2.checkDataType(group.type, data, opts.strictNumbers));
              iterateKeywords(it, group);
              if (types.length === 1 && types[0] === group.type && typeErrors) {
                  gen.else();
                  dataType_2.reportTypeError(it);
              }
              gen.endIf();
          }
          else {
              iterateKeywords(it, group);
          }
          // TODO make it "ok" call?
          if (!allErrors)
              gen.if(codegen_1$n._ `${names_1$3.default.errors} === ${errsCount || 0}`);
      }
  }
  function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults }, } = it;
      if (useDefaults)
          defaults_1.assignDefaults(it, group.type);
      gen.block(() => {
          for (const rule of group.rules) {
              if (applicability_1.shouldUseRule(schema, rule)) {
                  keywordCode(it, rule.keyword, rule.definition, group.type);
              }
          }
      });
  }
  function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
          return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
          checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
  }
  function checkContextTypes(it, types) {
      if (!types.length)
          return;
      if (!it.dataTypes.length) {
          it.dataTypes = types;
          return;
      }
      types.forEach((t) => {
          if (!includesType(it.dataTypes, t)) {
              strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
          }
      });
      it.dataTypes = it.dataTypes.filter((t) => includesType(types, t));
  }
  function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
          strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
  }
  function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
          const rule = rules[keyword];
          if (typeof rule == "object" && applicability_1.shouldUseRule(it.schema, rule)) {
              const { type } = rule.definition;
              if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
                  strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
              }
          }
      }
  }
  function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || (kwdT === "number" && schTs.includes("integer"));
  }
  function includesType(ts, t) {
      return ts.includes(t) || (t === "integer" && ts.includes("number"));
  }
  function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      util_1$k.checkStrictMode(it, msg, it.opts.strictTypes);
  }
  class KeywordCxt {
      constructor(it, def, keyword) {
          keyword_1.validateKeywordUsage(it, def, keyword);
          this.gen = it.gen;
          this.allErrors = it.allErrors;
          this.keyword = keyword;
          this.data = it.data;
          this.schema = it.schema[keyword];
          this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
          this.schemaValue = util_1$k.schemaRefOrVal(it, this.schema, keyword, this.$data);
          this.schemaType = def.schemaType;
          this.parentSchema = it.schema;
          this.params = {};
          this.it = it;
          this.def = def;
          if (this.$data) {
              this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
          }
          else {
              this.schemaCode = this.schemaValue;
              if (!keyword_1.validSchemaType(this.schema, def.schemaType, def.allowUndefined)) {
                  throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
              }
          }
          if ("code" in def ? def.trackErrors : def.errors !== false) {
              this.errsCount = it.gen.const("_errs", names_1$3.default.errors);
          }
      }
      result(condition, successAction, failAction) {
          this.failResult(codegen_1$n.not(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
          this.gen.if(condition);
          if (failAction)
              failAction();
          else
              this.error();
          if (successAction) {
              this.gen.else();
              successAction();
              if (this.allErrors)
                  this.gen.endIf();
          }
          else {
              if (this.allErrors)
                  this.gen.endIf();
              else
                  this.gen.else();
          }
      }
      pass(condition, failAction) {
          this.failResult(codegen_1$n.not(condition), undefined, failAction);
      }
      fail(condition) {
          if (condition === undefined) {
              this.error();
              if (!this.allErrors)
                  this.gen.if(false); // this branch will be removed by gen.optimize
              return;
          }
          this.gen.if(condition);
          this.error();
          if (this.allErrors)
              this.gen.endIf();
          else
              this.gen.else();
      }
      fail$data(condition) {
          if (!this.$data)
              return this.fail(condition);
          const { schemaCode } = this;
          this.fail(codegen_1$n._ `${schemaCode} !== undefined && (${codegen_1$n.or(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
          if (errorParams) {
              this.setParams(errorParams);
              this._error(append, errorPaths);
              this.setParams({});
              return;
          }
          this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
          (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
          errors_1.reportError(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
          if (this.errsCount === undefined)
              throw new Error('add "trackErrors" to keyword definition');
          errors_1.resetErrorsCount(this.gen, this.errsCount);
      }
      ok(cond) {
          if (!this.allErrors)
              this.gen.if(cond);
      }
      setParams(obj, assign) {
          if (assign)
              Object.assign(this.params, obj);
          else
              this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1$n.nil) {
          this.gen.block(() => {
              this.check$data(valid, $dataValid);
              codeBlock();
          });
      }
      check$data(valid = codegen_1$n.nil, $dataValid = codegen_1$n.nil) {
          if (!this.$data)
              return;
          const { gen, schemaCode, schemaType, def } = this;
          gen.if(codegen_1$n.or(codegen_1$n._ `${schemaCode} === undefined`, $dataValid));
          if (valid !== codegen_1$n.nil)
              gen.assign(valid, true);
          if (schemaType.length || def.validateSchema) {
              gen.elseIf(this.invalid$data());
              this.$dataError();
              if (valid !== codegen_1$n.nil)
                  gen.assign(valid, false);
          }
          gen.else();
      }
      invalid$data() {
          const { gen, schemaCode, schemaType, def, it } = this;
          return codegen_1$n.or(wrong$DataType(), invalid$DataSchema());
          function wrong$DataType() {
              if (schemaType.length) {
                  /* istanbul ignore if */
                  if (!(schemaCode instanceof codegen_1$n.Name))
                      throw new Error("ajv implementation error");
                  const st = Array.isArray(schemaType) ? schemaType : [schemaType];
                  return codegen_1$n._ `${dataType_2.checkDataTypes(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
              }
              return codegen_1$n.nil;
          }
          function invalid$DataSchema() {
              if (def.validateSchema) {
                  const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema }); // TODO value.code for standalone
                  return codegen_1$n._ `!${validateSchemaRef}(${schemaCode})`;
              }
              return codegen_1$n.nil;
          }
      }
      subschema(appl, valid) {
          const subschema = subschema_1.getSubschema(this.it, appl);
          subschema_1.extendSubschemaData(subschema, this.it, appl);
          subschema_1.extendSubschemaMode(subschema, appl);
          const nextContext = { ...this.it, ...subschema, items: undefined, props: undefined };
          subschemaCode(nextContext, valid);
          return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
          const { it, gen } = this;
          if (!it.opts.unevaluated)
              return;
          if (it.props !== true && schemaCxt.props !== undefined) {
              it.props = util_1$k.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
          }
          if (it.items !== true && schemaCxt.items !== undefined) {
              it.items = util_1$k.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
          }
      }
      mergeValidEvaluated(schemaCxt, valid) {
          const { it, gen } = this;
          if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
              gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1$n.Name));
              return true;
          }
      }
  }
  validate$1.KeywordCxt = KeywordCxt;
  function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
          def.code(cxt, ruleType);
      }
      else if (cxt.$data && def.validate) {
          keyword_1.funcKeywordCode(cxt, def);
      }
      else if ("macro" in def) {
          keyword_1.macroKeywordCode(cxt, def);
      }
      else if (def.compile || def.validate) {
          keyword_1.funcKeywordCode(cxt, def);
      }
  }
  const JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
  const RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
          return names_1$3.default.rootData;
      if ($data[0] === "/") {
          if (!JSON_POINTER.test($data))
              throw new Error(`Invalid JSON-pointer: ${$data}`);
          jsonPointer = $data;
          data = names_1$3.default.rootData;
      }
      else {
          const matches = RELATIVE_JSON_POINTER.exec($data);
          if (!matches)
              throw new Error(`Invalid JSON-pointer: ${$data}`);
          const up = +matches[1];
          jsonPointer = matches[2];
          if (jsonPointer === "#") {
              if (up >= dataLevel)
                  throw new Error(errorMsg("property/index", up));
              return dataPathArr[dataLevel - up];
          }
          if (up > dataLevel)
              throw new Error(errorMsg("data", up));
          data = dataNames[dataLevel - up];
          if (!jsonPointer)
              return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
          if (segment) {
              data = codegen_1$n._ `${data}${codegen_1$n.getProperty(util_1$k.unescapeJsonPointer(segment))}`;
              expr = codegen_1$n._ `${expr} && ${data}`;
          }
      }
      return expr;
      function errorMsg(pointerType, up) {
          return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
  }
  validate$1.getData = getData;

  var validation_error = {};

  Object.defineProperty(validation_error, "__esModule", { value: true });
  class ValidationError extends Error {
      constructor(errors) {
          super("validation failed");
          this.errors = errors;
          this.ajv = this.validation = true;
      }
  }
  validation_error.default = ValidationError;

  var ref_error = {};

  Object.defineProperty(ref_error, "__esModule", { value: true });
  const resolve_1$1 = resolve$1;
  class MissingRefError extends Error {
      constructor(baseId, ref, msg) {
          super(msg || `can't resolve reference ${ref} from id ${baseId}`);
          this.missingRef = resolve_1$1.resolveUrl(baseId, ref);
          this.missingSchema = resolve_1$1.normalizeId(resolve_1$1.getFullPath(this.missingRef));
      }
  }
  ref_error.default = MissingRefError;

  var compile = {};

  Object.defineProperty(compile, "__esModule", { value: true });
  compile.resolveSchema = compile.getCompilingSchema = compile.resolveRef = compile.compileSchema = compile.SchemaEnv = void 0;
  const codegen_1$m = codegen;
  const validation_error_1 = validation_error;
  const names_1$2 = names$1;
  const resolve_1 = resolve$1;
  const util_1$j = util;
  const validate_1$1 = validate$1;
  const URI = uri_all.exports;
  class SchemaEnv {
      constructor(env) {
          var _a;
          this.refs = {};
          this.dynamicAnchors = {};
          let schema;
          if (typeof env.schema == "object")
              schema = env.schema;
          this.schema = env.schema;
          this.schemaId = env.schemaId;
          this.root = env.root || this;
          this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : resolve_1.normalizeId(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
          this.schemaPath = env.schemaPath;
          this.localRefs = env.localRefs;
          this.meta = env.meta;
          this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
          this.refs = {};
      }
  }
  compile.SchemaEnv = SchemaEnv;
  // let codeSize = 0
  // let nodeCount = 0
  // Compiles schema in SchemaEnv
  function compileSchema(sch) {
      // TODO refactor - remove compilations
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
          return _sch;
      const rootId = resolve_1.getFullPath(sch.root.baseId); // TODO if getFullPath removed 1 tests fails
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1$m.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
          _ValidationError = gen.scopeValue("Error", {
              ref: validation_error_1.default,
              code: codegen_1$m._ `require("ajv/dist/runtime/validation_error").default`,
          });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
          gen,
          allErrors: this.opts.allErrors,
          data: names_1$2.default.data,
          parentData: names_1$2.default.parentData,
          parentDataProperty: names_1$2.default.parentDataProperty,
          dataNames: [names_1$2.default.data],
          dataPathArr: [codegen_1$m.nil],
          dataLevel: 0,
          dataTypes: [],
          definedProperties: new Set(),
          topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true
              ? { ref: sch.schema, code: codegen_1$m.stringify(sch.schema) }
              : { ref: sch.schema }),
          validateName,
          ValidationError: _ValidationError,
          schema: sch.schema,
          schemaEnv: sch,
          rootId,
          baseId: sch.baseId || rootId,
          schemaPath: codegen_1$m.nil,
          errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
          errorPath: codegen_1$m._ `""`,
          opts: this.opts,
          self: this,
      };
      let sourceCode;
      try {
          this._compilations.add(sch);
          validate_1$1.validateFunctionCode(schemaCxt);
          gen.optimize(this.opts.code.optimize);
          // gen.optimize(1)
          const validateCode = gen.toString();
          sourceCode = `${gen.scopeRefs(names_1$2.default.scope)}return ${validateCode}`;
          // console.log((codeSize += sourceCode.length), (nodeCount += gen.nodeCount))
          if (this.opts.code.process)
              sourceCode = this.opts.code.process(sourceCode, sch);
          // console.log("\n\n\n *** \n", sourceCode)
          const makeValidate = new Function(`${names_1$2.default.self}`, `${names_1$2.default.scope}`, sourceCode);
          const validate = makeValidate(this, this.scope.get());
          this.scope.value(validateName, { ref: validate });
          validate.errors = null;
          validate.schema = sch.schema;
          validate.schemaEnv = sch;
          if (sch.$async)
              validate.$async = true;
          if (this.opts.code.source === true) {
              validate.source = { validateName, validateCode, scopeValues: gen._values };
          }
          if (this.opts.unevaluated) {
              const { props, items } = schemaCxt;
              validate.evaluated = {
                  props: props instanceof codegen_1$m.Name ? undefined : props,
                  items: items instanceof codegen_1$m.Name ? undefined : items,
                  dynamicProps: props instanceof codegen_1$m.Name,
                  dynamicItems: items instanceof codegen_1$m.Name,
              };
              if (validate.source)
                  validate.source.evaluated = codegen_1$m.stringify(validate.evaluated);
          }
          sch.validate = validate;
          return sch;
      }
      catch (e) {
          delete sch.validate;
          delete sch.validateName;
          if (sourceCode)
              this.logger.error("Error compiling schema, function code:", sourceCode);
          // console.log("\n\n\n *** \n", sourceCode, this.opts)
          throw e;
      }
      finally {
          this._compilations.delete(sch);
      }
  }
  compile.compileSchema = compileSchema;
  function resolveRef(root, baseId, ref) {
      var _a;
      ref = resolve_1.resolveUrl(baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
          return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === undefined) {
          const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref]; // TODO maybe localRefs should hold SchemaEnv
          const { schemaId } = this.opts;
          if (schema)
              _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === undefined)
          return;
      return (root.refs[ref] = inlineOrCompile.call(this, _sch));
  }
  compile.resolveRef = resolveRef;
  function inlineOrCompile(sch) {
      if (resolve_1.inlineRef(sch.schema, this.opts.inlineRefs))
          return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
  }
  // Index of schema compilation in the currently compiled list
  function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
          if (sameSchemaEnv(sch, schEnv))
              return sch;
      }
  }
  compile.getCompilingSchema = getCompilingSchema;
  function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
  }
  // resolve and compile the references ($ref)
  // TODO returns AnySchemaObject (if the schema can be inlined) or validation function
  function resolve(root, // information about the root schema for the current schema
  ref // reference to resolve
  ) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
          ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
  }
  // Resolve schema, its root and baseId
  function resolveSchema(root, // root object with properties schema, refs TODO below SchemaEnv is assigned to it
  ref // reference to resolve
  ) {
      const p = URI.parse(ref);
      const refPath = resolve_1._getFullPath(p);
      let baseId = resolve_1.getFullPath(root.baseId);
      // TODO `Object.keys(root.schema).length > 0` should not be needed - but removing breaks 2 tests
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
          return getJsonPointer.call(this, p, root);
      }
      const id = resolve_1.normalizeId(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
          const sch = resolveSchema.call(this, root, schOrRef);
          if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
              return;
          return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
          return;
      if (!schOrRef.validate)
          compileSchema.call(this, schOrRef);
      if (id === resolve_1.normalizeId(ref)) {
          const { schema } = schOrRef;
          const { schemaId } = this.opts;
          const schId = schema[schemaId];
          if (schId)
              baseId = resolve_1.resolveUrl(baseId, schId);
          return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
  }
  compile.resolveSchema = resolveSchema;
  const PREVENT_SCOPE_CHANGE = new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions",
  ]);
  function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
          return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
          if (typeof schema == "boolean")
              return;
          schema = schema[util_1$j.unescapeFragment(part)];
          if (schema === undefined)
              return;
          // TODO PREVENT_SCOPE_CHANGE could be defined in keyword def?
          const schId = typeof schema == "object" && schema[this.opts.schemaId];
          if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
              baseId = resolve_1.resolveUrl(baseId, schId);
          }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !util_1$j.schemaHasRulesButRef(schema, this.RULES)) {
          const $ref = resolve_1.resolveUrl(baseId, schema.$ref);
          env = resolveSchema.call(this, root, $ref);
      }
      // even though resolution failed we need to return SchemaEnv to throw exception
      // so that compileAsync loads missing schema.
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
          return env;
      return undefined;
  }

  var $id$a = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
  var description$9 = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
  var type$b = "object";
  var required$8 = [
  	"$data"
  ];
  var properties$3 = {
  	$data: {
  		type: "string",
  		anyOf: [
  			{
  				format: "relative-json-pointer"
  			},
  			{
  				format: "json-pointer"
  			}
  		]
  	}
  };
  var additionalProperties$1 = false;
  var require$$9 = {
  	$id: $id$a,
  	description: description$9,
  	type: type$b,
  	required: required$8,
  	properties: properties$3,
  	additionalProperties: additionalProperties$1
  };

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
  var validate_1 = validate$1;
  Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
  var codegen_1 = codegen;
  Object.defineProperty(exports, "_", { enumerable: true, get: function () { return codegen_1._; } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
  Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
  const validation_error_1 = validation_error;
  const ref_error_1 = ref_error;
  const rules_1 = rules;
  const compile_1 = compile;
  const codegen_2 = codegen;
  const resolve_1 = resolve$1;
  const dataType_1 = dataType;
  const util_1 = util;
  const $dataRefSchema = require$$9;
  const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
  const EXT_SCOPE_NAMES = new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error",
  ]);
  const removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now.",
  };
  const deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.',
  };
  const MAX_EXPRESSION = 200;
  // eslint-disable-next-line complexity
  function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
      return {
          strictSchema: (_c = (_b = o.strictSchema) !== null && _b !== void 0 ? _b : s) !== null && _c !== void 0 ? _c : true,
          strictNumbers: (_e = (_d = o.strictNumbers) !== null && _d !== void 0 ? _d : s) !== null && _e !== void 0 ? _e : true,
          strictTypes: (_g = (_f = o.strictTypes) !== null && _f !== void 0 ? _f : s) !== null && _g !== void 0 ? _g : "log",
          strictTuples: (_j = (_h = o.strictTuples) !== null && _h !== void 0 ? _h : s) !== null && _j !== void 0 ? _j : "log",
          strictRequired: (_l = (_k = o.strictRequired) !== null && _k !== void 0 ? _k : s) !== null && _l !== void 0 ? _l : false,
          code: o.code ? { ...o.code, optimize } : { optimize },
          loopRequired: (_m = o.loopRequired) !== null && _m !== void 0 ? _m : MAX_EXPRESSION,
          loopEnum: (_o = o.loopEnum) !== null && _o !== void 0 ? _o : MAX_EXPRESSION,
          meta: (_p = o.meta) !== null && _p !== void 0 ? _p : true,
          messages: (_q = o.messages) !== null && _q !== void 0 ? _q : true,
          inlineRefs: (_r = o.inlineRefs) !== null && _r !== void 0 ? _r : true,
          schemaId: (_s = o.schemaId) !== null && _s !== void 0 ? _s : "$id",
          addUsedSchema: (_t = o.addUsedSchema) !== null && _t !== void 0 ? _t : true,
          validateSchema: (_u = o.validateSchema) !== null && _u !== void 0 ? _u : true,
          validateFormats: (_v = o.validateFormats) !== null && _v !== void 0 ? _v : true,
          unicodeRegExp: (_w = o.unicodeRegExp) !== null && _w !== void 0 ? _w : true,
          int32range: (_x = o.int32range) !== null && _x !== void 0 ? _x : true,
      };
  }
  class Ajv {
      constructor(opts = {}) {
          this.schemas = {};
          this.refs = {};
          this.formats = {};
          this._compilations = new Set();
          this._loading = {};
          this._cache = new Map();
          opts = this.opts = { ...opts, ...requiredOptions(opts) };
          const { es5, lines } = this.opts.code;
          this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
          this.logger = getLogger(opts.logger);
          const formatOpt = opts.validateFormats;
          opts.validateFormats = false;
          this.RULES = rules_1.getRules();
          checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
          checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
          this._metaOpts = getMetaSchemaOptions.call(this);
          if (opts.formats)
              addInitialFormats.call(this);
          this._addVocabularies();
          this._addDefaultMetaSchema();
          if (opts.keywords)
              addInitialKeywords.call(this, opts.keywords);
          if (typeof opts.meta == "object")
              this.addMetaSchema(opts.meta);
          addInitialSchemas.call(this);
          opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
          this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
          const { $data, meta, schemaId } = this.opts;
          let _dataRefSchema = $dataRefSchema;
          if (schemaId === "id") {
              _dataRefSchema = { ...$dataRefSchema };
              _dataRefSchema.id = _dataRefSchema.$id;
              delete _dataRefSchema.$id;
          }
          if (meta && $data)
              this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
          const { meta, schemaId } = this.opts;
          return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
      }
      validate(schemaKeyRef, // key, ref or schema object
      data // to be validated
      ) {
          let v;
          if (typeof schemaKeyRef == "string") {
              v = this.getSchema(schemaKeyRef);
              if (!v)
                  throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
          }
          else {
              v = this.compile(schemaKeyRef);
          }
          const valid = v(data);
          if (!("$async" in v))
              this.errors = v.errors;
          return valid;
      }
      compile(schema, _meta) {
          const sch = this._addSchema(schema, _meta);
          return (sch.validate || this._compileSchemaEnv(sch));
      }
      compileAsync(schema, meta) {
          if (typeof this.opts.loadSchema != "function") {
              throw new Error("options.loadSchema should be a function");
          }
          const { loadSchema } = this.opts;
          return runCompileAsync.call(this, schema, meta);
          async function runCompileAsync(_schema, _meta) {
              await loadMetaSchema.call(this, _schema.$schema);
              const sch = this._addSchema(_schema, _meta);
              return sch.validate || _compileAsync.call(this, sch);
          }
          async function loadMetaSchema($ref) {
              if ($ref && !this.getSchema($ref)) {
                  await runCompileAsync.call(this, { $ref }, true);
              }
          }
          async function _compileAsync(sch) {
              try {
                  return this._compileSchemaEnv(sch);
              }
              catch (e) {
                  if (!(e instanceof ref_error_1.default))
                      throw e;
                  checkLoaded.call(this, e);
                  await loadMissingSchema.call(this, e.missingSchema);
                  return _compileAsync.call(this, sch);
              }
          }
          function checkLoaded({ missingSchema: ref, missingRef }) {
              if (this.refs[ref]) {
                  throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
              }
          }
          async function loadMissingSchema(ref) {
              const _schema = await _loadSchema.call(this, ref);
              if (!this.refs[ref])
                  await loadMetaSchema.call(this, _schema.$schema);
              if (!this.refs[ref])
                  this.addSchema(_schema, ref, meta);
          }
          async function _loadSchema(ref) {
              const p = this._loading[ref];
              if (p)
                  return p;
              try {
                  return await (this._loading[ref] = loadSchema(ref));
              }
              finally {
                  delete this._loading[ref];
              }
          }
      }
      // Adds schema to the instance
      addSchema(schema, // If array is passed, `key` will be ignored
      key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
      _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
      _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
      ) {
          if (Array.isArray(schema)) {
              for (const sch of schema)
                  this.addSchema(sch, undefined, _meta, _validateSchema);
              return this;
          }
          let id;
          if (typeof schema === "object") {
              const { schemaId } = this.opts;
              id = schema[schemaId];
              if (id !== undefined && typeof id != "string") {
                  throw new Error(`schema ${schemaId} must be string`);
              }
          }
          key = resolve_1.normalizeId(key || id);
          this._checkUnique(key);
          this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
          return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, // schema key
      _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
      ) {
          this.addSchema(schema, key, true, _validateSchema);
          return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
          if (typeof schema == "boolean")
              return true;
          let $schema;
          $schema = schema.$schema;
          if ($schema !== undefined && typeof $schema != "string") {
              throw new Error("$schema must be a string");
          }
          $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
          if (!$schema) {
              this.logger.warn("meta-schema not available");
              this.errors = null;
              return true;
          }
          const valid = this.validate($schema, schema);
          if (!valid && throwOrLogError) {
              const message = "schema is invalid: " + this.errorsText();
              if (this.opts.validateSchema === "log")
                  this.logger.error(message);
              else
                  throw new Error(message);
          }
          return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
          let sch;
          while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
              keyRef = sch;
          if (sch === undefined) {
              const { schemaId } = this.opts;
              const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
              sch = compile_1.resolveSchema.call(this, root, keyRef);
              if (!sch)
                  return;
              this.refs[keyRef] = sch;
          }
          return (sch.validate || this._compileSchemaEnv(sch));
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
          if (schemaKeyRef instanceof RegExp) {
              this._removeAllSchemas(this.schemas, schemaKeyRef);
              this._removeAllSchemas(this.refs, schemaKeyRef);
              return this;
          }
          switch (typeof schemaKeyRef) {
              case "undefined":
                  this._removeAllSchemas(this.schemas);
                  this._removeAllSchemas(this.refs);
                  this._cache.clear();
                  return this;
              case "string": {
                  const sch = getSchEnv.call(this, schemaKeyRef);
                  if (typeof sch == "object")
                      this._cache.delete(sch.schema);
                  delete this.schemas[schemaKeyRef];
                  delete this.refs[schemaKeyRef];
                  return this;
              }
              case "object": {
                  const cacheKey = schemaKeyRef;
                  this._cache.delete(cacheKey);
                  let id = schemaKeyRef[this.opts.schemaId];
                  if (id) {
                      id = resolve_1.normalizeId(id);
                      delete this.schemas[id];
                      delete this.refs[id];
                  }
                  return this;
              }
              default:
                  throw new Error("ajv.removeSchema: invalid parameter");
          }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
          for (const def of definitions)
              this.addKeyword(def);
          return this;
      }
      addKeyword(kwdOrDef, def // deprecated
      ) {
          let keyword;
          if (typeof kwdOrDef == "string") {
              keyword = kwdOrDef;
              if (typeof def == "object") {
                  this.logger.warn("these parameters are deprecated, see docs for addKeyword");
                  def.keyword = keyword;
              }
          }
          else if (typeof kwdOrDef == "object" && def === undefined) {
              def = kwdOrDef;
              keyword = def.keyword;
              if (Array.isArray(keyword) && !keyword.length) {
                  throw new Error("addKeywords: keyword must be string or non-empty array");
              }
          }
          else {
              throw new Error("invalid addKeywords parameters");
          }
          checkKeyword.call(this, keyword, def);
          if (!def) {
              util_1.eachItem(keyword, (kwd) => addRule.call(this, kwd));
              return this;
          }
          keywordMetaschema.call(this, def);
          const definition = {
              ...def,
              type: dataType_1.getJSONTypes(def.type),
              schemaType: dataType_1.getJSONTypes(def.schemaType),
          };
          util_1.eachItem(keyword, definition.type.length === 0
              ? (k) => addRule.call(this, k, definition)
              : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
          return this;
      }
      getKeyword(keyword) {
          const rule = this.RULES.all[keyword];
          return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
          // TODO return type should be Ajv
          const { RULES } = this;
          delete RULES.keywords[keyword];
          delete RULES.all[keyword];
          for (const group of RULES.rules) {
              const i = group.rules.findIndex((rule) => rule.keyword === keyword);
              if (i >= 0)
                  group.rules.splice(i, 1);
          }
          return this;
      }
      // Add format
      addFormat(name, format) {
          if (typeof format == "string")
              format = new RegExp(format);
          this.formats[name] = format;
          return this;
      }
      errorsText(errors = this.errors, // optional array of validation errors
      { separator = ", ", dataVar = "data" } = {} // optional options with properties `separator` and `dataVar`
      ) {
          if (!errors || errors.length === 0)
              return "No errors";
          return errors
              .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
              .reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
          const rules = this.RULES.all;
          metaSchema = JSON.parse(JSON.stringify(metaSchema));
          for (const jsonPointer of keywordsJsonPointers) {
              const segments = jsonPointer.split("/").slice(1); // first segment is an empty string
              let keywords = metaSchema;
              for (const seg of segments)
                  keywords = keywords[seg];
              for (const key in rules) {
                  const rule = rules[key];
                  if (typeof rule != "object")
                      continue;
                  const { $data } = rule.definition;
                  const schema = keywords[key];
                  if ($data && schema)
                      keywords[key] = schemaOrData(schema);
              }
          }
          return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
          for (const keyRef in schemas) {
              const sch = schemas[keyRef];
              if (!regex || regex.test(keyRef)) {
                  if (typeof sch == "string") {
                      delete schemas[keyRef];
                  }
                  else if (sch && !sch.meta) {
                      this._cache.delete(sch.schema);
                      delete schemas[keyRef];
                  }
              }
          }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
          let id;
          const { schemaId } = this.opts;
          if (typeof schema == "object") {
              id = schema[schemaId];
          }
          else {
              if (this.opts.jtd)
                  throw new Error("schema must be object");
              else if (typeof schema != "boolean")
                  throw new Error("schema must be object or boolean");
          }
          let sch = this._cache.get(schema);
          if (sch !== undefined)
              return sch;
          const localRefs = resolve_1.getSchemaRefs.call(this, schema);
          baseId = resolve_1.normalizeId(id || baseId);
          sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
          this._cache.set(sch.schema, sch);
          if (addSchema && !baseId.startsWith("#")) {
              // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
              if (baseId)
                  this._checkUnique(baseId);
              this.refs[baseId] = sch;
          }
          if (validateSchema)
              this.validateSchema(schema, true);
          return sch;
      }
      _checkUnique(id) {
          if (this.schemas[id] || this.refs[id]) {
              throw new Error(`schema with key or id "${id}" already exists`);
          }
      }
      _compileSchemaEnv(sch) {
          if (sch.meta)
              this._compileMetaSchema(sch);
          else
              compile_1.compileSchema.call(this, sch);
          /* istanbul ignore if */
          if (!sch.validate)
              throw new Error("ajv implementation error");
          return sch.validate;
      }
      _compileMetaSchema(sch) {
          const currentOpts = this.opts;
          this.opts = this._metaOpts;
          try {
              compile_1.compileSchema.call(this, sch);
          }
          finally {
              this.opts = currentOpts;
          }
      }
  }
  exports.default = Ajv;
  Ajv.ValidationError = validation_error_1.default;
  Ajv.MissingRefError = ref_error_1.default;
  function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
          const opt = key;
          if (opt in options)
              this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
  }
  function getSchEnv(keyRef) {
      keyRef = resolve_1.normalizeId(keyRef); // TODO tests fail without this line
      return this.schemas[keyRef] || this.refs[keyRef];
  }
  function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
          return;
      if (Array.isArray(optsSchemas))
          this.addSchema(optsSchemas);
      else
          for (const key in optsSchemas)
              this.addSchema(optsSchemas[key], key);
  }
  function addInitialFormats() {
      for (const name in this.opts.formats) {
          const format = this.opts.formats[name];
          if (format)
              this.addFormat(name, format);
      }
  }
  function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
          this.addVocabulary(defs);
          return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
          const def = defs[keyword];
          if (!def.keyword)
              def.keyword = keyword;
          this.addKeyword(def);
      }
  }
  function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
          delete metaOpts[opt];
      return metaOpts;
  }
  const noLogs = { log() { }, warn() { }, error() { } };
  function getLogger(logger) {
      if (logger === false)
          return noLogs;
      if (logger === undefined)
          return console;
      if (logger.log && logger.warn && logger.error)
          return logger;
      throw new Error("logger must implement log, warn and error methods");
  }
  const KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
  function checkKeyword(keyword, def) {
      const { RULES } = this;
      util_1.eachItem(keyword, (kwd) => {
          if (RULES.keywords[kwd])
              throw new Error(`Keyword ${kwd} is already defined`);
          if (!KEYWORD_NAME.test(kwd))
              throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
          return;
      if (def.$data && !("code" in def || "validate" in def)) {
          throw new Error('$data keyword must have "code" or "validate" function');
      }
  }
  function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
          throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
          ruleGroup = { type: dataType, rules: [] };
          RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
          return;
      const rule = {
          keyword,
          definition: {
              ...definition,
              type: dataType_1.getJSONTypes(definition.type),
              schemaType: dataType_1.getJSONTypes(definition.schemaType),
          },
      };
      if (definition.before)
          addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
          ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
  }
  function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
          ruleGroup.rules.splice(i, 0, rule);
      }
      else {
          ruleGroup.rules.push(rule);
          this.logger.warn(`rule ${before} is not defined`);
      }
  }
  function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === undefined)
          return;
      if (def.$data && this.opts.$data)
          metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
  }
  const $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
  };
  function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
  }

  }(core$3));

  var draft7 = {};

  var core$2 = {};

  var id = {};

  Object.defineProperty(id, "__esModule", { value: true });
  const def$s = {
      keyword: "id",
      code() {
          throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      },
  };
  id.default = def$s;

  var ref = {};

  Object.defineProperty(ref, "__esModule", { value: true });
  ref.callRef = ref.getValidate = void 0;
  const ref_error_1 = ref_error;
  const code_1$8 = code;
  const codegen_1$l = codegen;
  const names_1$1 = names$1;
  const compile_1 = compile;
  const util_1$i = util;
  const def$r = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
          const { gen, schema: $ref, it } = cxt;
          const { baseId, schemaEnv: env, validateName, opts, self } = it;
          const { root } = env;
          if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
              return callRootRef();
          const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
          if (schOrEnv === undefined)
              throw new ref_error_1.default(baseId, $ref);
          if (schOrEnv instanceof compile_1.SchemaEnv)
              return callValidate(schOrEnv);
          return inlineRefSchema(schOrEnv);
          function callRootRef() {
              if (env === root)
                  return callRef(cxt, validateName, env, env.$async);
              const rootName = gen.scopeValue("root", { ref: root });
              return callRef(cxt, codegen_1$l._ `${rootName}.validate`, root, root.$async);
          }
          function callValidate(sch) {
              const v = getValidate(cxt, sch);
              callRef(cxt, v, sch, sch.$async);
          }
          function inlineRefSchema(sch) {
              const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: codegen_1$l.stringify(sch) } : { ref: sch });
              const valid = gen.name("valid");
              const schCxt = cxt.subschema({
                  schema: sch,
                  dataTypes: [],
                  schemaPath: codegen_1$l.nil,
                  topSchemaRef: schName,
                  errSchemaPath: $ref,
              }, valid);
              cxt.mergeEvaluated(schCxt);
              cxt.ok(valid);
          }
      },
  };
  function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate
          ? gen.scopeValue("validate", { ref: sch.validate })
          : codegen_1$l._ `${gen.scopeValue("wrapper", { ref: sch })}.validate`;
  }
  ref.getValidate = getValidate;
  function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1$1.default.this : codegen_1$l.nil;
      if ($async)
          callAsyncRef();
      else
          callSyncRef();
      function callAsyncRef() {
          if (!env.$async)
              throw new Error("async schema referenced by sync schema");
          const valid = gen.let("valid");
          gen.try(() => {
              gen.code(codegen_1$l._ `await ${code_1$8.callValidateCode(cxt, v, passCxt)}`);
              addEvaluatedFrom(v); // TODO will not work with async, it has to be returned with the result
              if (!allErrors)
                  gen.assign(valid, true);
          }, (e) => {
              gen.if(codegen_1$l._ `!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
              addErrorsFrom(e);
              if (!allErrors)
                  gen.assign(valid, false);
          });
          cxt.ok(valid);
      }
      function callSyncRef() {
          cxt.result(code_1$8.callValidateCode(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
          const errs = codegen_1$l._ `${source}.errors`;
          gen.assign(names_1$1.default.vErrors, codegen_1$l._ `${names_1$1.default.vErrors} === null ? ${errs} : ${names_1$1.default.vErrors}.concat(${errs})`); // TODO tagged
          gen.assign(names_1$1.default.errors, codegen_1$l._ `${names_1$1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
          var _a;
          if (!it.opts.unevaluated)
              return;
          const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
          // TODO refactor
          if (it.props !== true) {
              if (schEvaluated && !schEvaluated.dynamicProps) {
                  if (schEvaluated.props !== undefined) {
                      it.props = util_1$i.mergeEvaluated.props(gen, schEvaluated.props, it.props);
                  }
              }
              else {
                  const props = gen.var("props", codegen_1$l._ `${source}.evaluated.props`);
                  it.props = util_1$i.mergeEvaluated.props(gen, props, it.props, codegen_1$l.Name);
              }
          }
          if (it.items !== true) {
              if (schEvaluated && !schEvaluated.dynamicItems) {
                  if (schEvaluated.items !== undefined) {
                      it.items = util_1$i.mergeEvaluated.items(gen, schEvaluated.items, it.items);
                  }
              }
              else {
                  const items = gen.var("items", codegen_1$l._ `${source}.evaluated.items`);
                  it.items = util_1$i.mergeEvaluated.items(gen, items, it.items, codegen_1$l.Name);
              }
          }
      }
  }
  ref.callRef = callRef;
  ref.default = def$r;

  Object.defineProperty(core$2, "__esModule", { value: true });
  const id_1 = id;
  const ref_1 = ref;
  const core$1 = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default,
  ];
  core$2.default = core$1;

  var validation$1 = {};

  var limitNumber = {};

  Object.defineProperty(limitNumber, "__esModule", { value: true });
  const codegen_1$k = codegen;
  const ops = codegen_1$k.operators;
  const KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE },
  };
  const error$i = {
      message: ({ keyword, schemaCode }) => codegen_1$k.str `must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => codegen_1$k._ `{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`,
  };
  const def$q = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error: error$i,
      code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          cxt.fail$data(codegen_1$k._ `${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      },
  };
  limitNumber.default = def$q;

  var multipleOf = {};

  Object.defineProperty(multipleOf, "__esModule", { value: true });
  const codegen_1$j = codegen;
  const error$h = {
      message: ({ schemaCode }) => codegen_1$j.str `must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => codegen_1$j._ `{multipleOf: ${schemaCode}}`,
  };
  const def$p = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error: error$h,
      code(cxt) {
          const { gen, data, schemaCode, it } = cxt;
          // const bdt = bad$DataType(schemaCode, <string>def.schemaType, $data)
          const prec = it.opts.multipleOfPrecision;
          const res = gen.let("res");
          const invalid = prec
              ? codegen_1$j._ `Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
              : codegen_1$j._ `${res} !== parseInt(${res})`;
          cxt.fail$data(codegen_1$j._ `(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      },
  };
  multipleOf.default = def$p;

  var limitLength = {};

  var ucs2length$1 = {};

  Object.defineProperty(ucs2length$1, "__esModule", { value: true });
  // https://mathiasbynens.be/notes/javascript-encoding
  // https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
  function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
          length++;
          value = str.charCodeAt(pos++);
          if (value >= 0xd800 && value <= 0xdbff && pos < len) {
              // high surrogate, and there is a next character
              value = str.charCodeAt(pos);
              if ((value & 0xfc00) === 0xdc00)
                  pos++; // low surrogate
          }
      }
      return length;
  }
  ucs2length$1.default = ucs2length;
  ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';

  Object.defineProperty(limitLength, "__esModule", { value: true });
  const codegen_1$i = codegen;
  const util_1$h = util;
  const ucs2length_1 = ucs2length$1;
  const error$g = {
      message({ keyword, schemaCode }) {
          const comp = keyword === "maxLength" ? "more" : "fewer";
          return codegen_1$i.str `must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => codegen_1$i._ `{limit: ${schemaCode}}`,
  };
  const def$o = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error: error$g,
      code(cxt) {
          const { keyword, data, schemaCode, it } = cxt;
          const op = keyword === "maxLength" ? codegen_1$i.operators.GT : codegen_1$i.operators.LT;
          const len = it.opts.unicode === false ? codegen_1$i._ `${data}.length` : codegen_1$i._ `${util_1$h.useFunc(cxt.gen, ucs2length_1.default)}(${data})`;
          cxt.fail$data(codegen_1$i._ `${len} ${op} ${schemaCode}`);
      },
  };
  limitLength.default = def$o;

  var pattern = {};

  Object.defineProperty(pattern, "__esModule", { value: true });
  const code_1$7 = code;
  const codegen_1$h = codegen;
  const error$f = {
      message: ({ schemaCode }) => codegen_1$h.str `must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => codegen_1$h._ `{pattern: ${schemaCode}}`,
  };
  const def$n = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error: error$f,
      code(cxt) {
          const { data, $data, schema, schemaCode, it } = cxt;
          // TODO regexp should be wrapped in try/catchs
          const u = it.opts.unicodeRegExp ? "u" : "";
          const regExp = $data ? codegen_1$h._ `(new RegExp(${schemaCode}, ${u}))` : code_1$7.usePattern(cxt, schema);
          cxt.fail$data(codegen_1$h._ `!${regExp}.test(${data})`);
      },
  };
  pattern.default = def$n;

  var limitProperties = {};

  Object.defineProperty(limitProperties, "__esModule", { value: true });
  const codegen_1$g = codegen;
  const error$e = {
      message({ keyword, schemaCode }) {
          const comp = keyword === "maxProperties" ? "more" : "fewer";
          return codegen_1$g.str `must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => codegen_1$g._ `{limit: ${schemaCode}}`,
  };
  const def$m = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error: error$e,
      code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          const op = keyword === "maxProperties" ? codegen_1$g.operators.GT : codegen_1$g.operators.LT;
          cxt.fail$data(codegen_1$g._ `Object.keys(${data}).length ${op} ${schemaCode}`);
      },
  };
  limitProperties.default = def$m;

  var required$7 = {};

  Object.defineProperty(required$7, "__esModule", { value: true });
  const code_1$6 = code;
  const codegen_1$f = codegen;
  const util_1$g = util;
  const error$d = {
      message: ({ params: { missingProperty } }) => codegen_1$f.str `must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => codegen_1$f._ `{missingProperty: ${missingProperty}}`,
  };
  const def$l = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error: error$d,
      code(cxt) {
          const { gen, schema, schemaCode, data, $data, it } = cxt;
          const { opts } = it;
          if (!$data && schema.length === 0)
              return;
          const useLoop = schema.length >= opts.loopRequired;
          if (it.allErrors)
              allErrorsMode();
          else
              exitOnErrorMode();
          if (opts.strictRequired) {
              const props = cxt.parentSchema.properties;
              const { definedProperties } = cxt.it;
              for (const requiredKey of schema) {
                  if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === undefined && !definedProperties.has(requiredKey)) {
                      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
                      const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
                      util_1$g.checkStrictMode(it, msg, it.opts.strictRequired);
                  }
              }
          }
          function allErrorsMode() {
              if (useLoop || $data) {
                  cxt.block$data(codegen_1$f.nil, loopAllRequired);
              }
              else {
                  for (const prop of schema) {
                      code_1$6.checkReportMissingProp(cxt, prop);
                  }
              }
          }
          function exitOnErrorMode() {
              const missing = gen.let("missing");
              if (useLoop || $data) {
                  const valid = gen.let("valid", true);
                  cxt.block$data(valid, () => loopUntilMissing(missing, valid));
                  cxt.ok(valid);
              }
              else {
                  gen.if(code_1$6.checkMissingProp(cxt, schema, missing));
                  code_1$6.reportMissingProp(cxt, missing);
                  gen.else();
              }
          }
          function loopAllRequired() {
              gen.forOf("prop", schemaCode, (prop) => {
                  cxt.setParams({ missingProperty: prop });
                  gen.if(code_1$6.noPropertyInData(gen, data, prop, opts.ownProperties), () => cxt.error());
              });
          }
          function loopUntilMissing(missing, valid) {
              cxt.setParams({ missingProperty: missing });
              gen.forOf(missing, schemaCode, () => {
                  gen.assign(valid, code_1$6.propertyInData(gen, data, missing, opts.ownProperties));
                  gen.if(codegen_1$f.not(valid), () => {
                      cxt.error();
                      gen.break();
                  });
              }, codegen_1$f.nil);
          }
      },
  };
  required$7.default = def$l;

  var limitItems = {};

  Object.defineProperty(limitItems, "__esModule", { value: true });
  const codegen_1$e = codegen;
  const error$c = {
      message({ keyword, schemaCode }) {
          const comp = keyword === "maxItems" ? "more" : "fewer";
          return codegen_1$e.str `must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => codegen_1$e._ `{limit: ${schemaCode}}`,
  };
  const def$k = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error: error$c,
      code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          const op = keyword === "maxItems" ? codegen_1$e.operators.GT : codegen_1$e.operators.LT;
          cxt.fail$data(codegen_1$e._ `${data}.length ${op} ${schemaCode}`);
      },
  };
  limitItems.default = def$k;

  var uniqueItems = {};

  var equal$1 = {};

  Object.defineProperty(equal$1, "__esModule", { value: true });
  // https://github.com/ajv-validator/ajv/issues/889
  const equal = fastDeepEqual;
  equal.code = 'require("ajv/dist/runtime/equal").default';
  equal$1.default = equal;

  Object.defineProperty(uniqueItems, "__esModule", { value: true });
  const dataType_1 = dataType;
  const codegen_1$d = codegen;
  const util_1$f = util;
  const equal_1$2 = equal$1;
  const error$b = {
      message: ({ params: { i, j } }) => codegen_1$d.str `must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => codegen_1$d._ `{i: ${i}, j: ${j}}`,
  };
  const def$j = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error: error$b,
      code(cxt) {
          const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
          if (!$data && !schema)
              return;
          const valid = gen.let("valid");
          const itemTypes = parentSchema.items ? dataType_1.getSchemaTypes(parentSchema.items) : [];
          cxt.block$data(valid, validateUniqueItems, codegen_1$d._ `${schemaCode} === false`);
          cxt.ok(valid);
          function validateUniqueItems() {
              const i = gen.let("i", codegen_1$d._ `${data}.length`);
              const j = gen.let("j");
              cxt.setParams({ i, j });
              gen.assign(valid, true);
              gen.if(codegen_1$d._ `${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
          }
          function canOptimize() {
              return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
          }
          function loopN(i, j) {
              const item = gen.name("item");
              const wrongType = dataType_1.checkDataTypes(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
              const indices = gen.const("indices", codegen_1$d._ `{}`);
              gen.for(codegen_1$d._ `;${i}--;`, () => {
                  gen.let(item, codegen_1$d._ `${data}[${i}]`);
                  gen.if(wrongType, codegen_1$d._ `continue`);
                  if (itemTypes.length > 1)
                      gen.if(codegen_1$d._ `typeof ${item} == "string"`, codegen_1$d._ `${item} += "_"`);
                  gen
                      .if(codegen_1$d._ `typeof ${indices}[${item}] == "number"`, () => {
                      gen.assign(j, codegen_1$d._ `${indices}[${item}]`);
                      cxt.error();
                      gen.assign(valid, false).break();
                  })
                      .code(codegen_1$d._ `${indices}[${item}] = ${i}`);
              });
          }
          function loopN2(i, j) {
              const eql = util_1$f.useFunc(gen, equal_1$2.default);
              const outer = gen.name("outer");
              gen.label(outer).for(codegen_1$d._ `;${i}--;`, () => gen.for(codegen_1$d._ `${j} = ${i}; ${j}--;`, () => gen.if(codegen_1$d._ `${eql}(${data}[${i}], ${data}[${j}])`, () => {
                  cxt.error();
                  gen.assign(valid, false).break(outer);
              })));
          }
      },
  };
  uniqueItems.default = def$j;

  var _const = {};

  Object.defineProperty(_const, "__esModule", { value: true });
  const codegen_1$c = codegen;
  const util_1$e = util;
  const equal_1$1 = equal$1;
  const error$a = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => codegen_1$c._ `{allowedValue: ${schemaCode}}`,
  };
  const def$i = {
      keyword: "const",
      $data: true,
      error: error$a,
      code(cxt) {
          const { gen, data, $data, schemaCode, schema } = cxt;
          if ($data || (schema && typeof schema == "object")) {
              cxt.fail$data(codegen_1$c._ `!${util_1$e.useFunc(gen, equal_1$1.default)}(${data}, ${schemaCode})`);
          }
          else {
              cxt.fail(codegen_1$c._ `${schema} !== ${data}`);
          }
      },
  };
  _const.default = def$i;

  var _enum = {};

  Object.defineProperty(_enum, "__esModule", { value: true });
  const codegen_1$b = codegen;
  const util_1$d = util;
  const equal_1 = equal$1;
  const error$9 = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => codegen_1$b._ `{allowedValues: ${schemaCode}}`,
  };
  const def$h = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error: error$9,
      code(cxt) {
          const { gen, data, $data, schema, schemaCode, it } = cxt;
          if (!$data && schema.length === 0)
              throw new Error("enum must have non-empty array");
          const useLoop = schema.length >= it.opts.loopEnum;
          const eql = util_1$d.useFunc(gen, equal_1.default);
          let valid;
          if (useLoop || $data) {
              valid = gen.let("valid");
              cxt.block$data(valid, loopEnum);
          }
          else {
              /* istanbul ignore if */
              if (!Array.isArray(schema))
                  throw new Error("ajv implementation error");
              const vSchema = gen.const("vSchema", schemaCode);
              valid = codegen_1$b.or(...schema.map((_x, i) => equalCode(vSchema, i)));
          }
          cxt.pass(valid);
          function loopEnum() {
              gen.assign(valid, false);
              gen.forOf("v", schemaCode, (v) => gen.if(codegen_1$b._ `${eql}(${data}, ${v})`, () => gen.assign(valid, true).break()));
          }
          function equalCode(vSchema, i) {
              const sch = schema[i];
              return typeof sch === "object" && sch !== null
                  ? codegen_1$b._ `${eql}(${data}, ${vSchema}[${i}])`
                  : codegen_1$b._ `${data} === ${sch}`;
          }
      },
  };
  _enum.default = def$h;

  Object.defineProperty(validation$1, "__esModule", { value: true });
  const limitNumber_1 = limitNumber;
  const multipleOf_1 = multipleOf;
  const limitLength_1 = limitLength;
  const pattern_1 = pattern;
  const limitProperties_1 = limitProperties;
  const required_1 = required$7;
  const limitItems_1 = limitItems;
  const uniqueItems_1 = uniqueItems;
  const const_1 = _const;
  const enum_1 = _enum;
  const validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default,
  ];
  validation$1.default = validation;

  var applicator = {};

  var additionalItems = {};

  Object.defineProperty(additionalItems, "__esModule", { value: true });
  additionalItems.validateAdditionalItems = void 0;
  const codegen_1$a = codegen;
  const util_1$c = util;
  const error$8 = {
      message: ({ params: { len } }) => codegen_1$a.str `must NOT have more than ${len} items`,
      params: ({ params: { len } }) => codegen_1$a._ `{limit: ${len}}`,
  };
  const def$g = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error: error$8,
      code(cxt) {
          const { parentSchema, it } = cxt;
          const { items } = parentSchema;
          if (!Array.isArray(items)) {
              util_1$c.checkStrictMode(it, '"additionalItems" is ignored when "items" is not an array of schemas');
              return;
          }
          validateAdditionalItems(cxt, items);
      },
  };
  function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", codegen_1$a._ `${data}.length`);
      if (schema === false) {
          cxt.setParams({ len: items.length });
          cxt.pass(codegen_1$a._ `${len} <= ${items.length}`);
      }
      else if (typeof schema == "object" && !util_1$c.alwaysValidSchema(it, schema)) {
          const valid = gen.var("valid", codegen_1$a._ `${len} <= ${items.length}`); // TODO var
          gen.if(codegen_1$a.not(valid), () => validateItems(valid));
          cxt.ok(valid);
      }
      function validateItems(valid) {
          gen.forRange("i", items.length, len, (i) => {
              cxt.subschema({ keyword, dataProp: i, dataPropType: util_1$c.Type.Num }, valid);
              if (!it.allErrors)
                  gen.if(codegen_1$a.not(valid), () => gen.break());
          });
      }
  }
  additionalItems.validateAdditionalItems = validateAdditionalItems;
  additionalItems.default = def$g;

  var prefixItems = {};

  var items = {};

  Object.defineProperty(items, "__esModule", { value: true });
  items.validateTuple = void 0;
  const codegen_1$9 = codegen;
  const util_1$b = util;
  const code_1$5 = code;
  const def$f = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
          const { schema, it } = cxt;
          if (Array.isArray(schema))
              return validateTuple(cxt, "additionalItems", schema);
          it.items = true;
          if (util_1$b.alwaysValidSchema(it, schema))
              return;
          cxt.ok(code_1$5.validateArray(cxt));
      },
  };
  function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
          it.items = util_1$b.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", codegen_1$9._ `${data}.length`);
      schArr.forEach((sch, i) => {
          if (util_1$b.alwaysValidSchema(it, sch))
              return;
          gen.if(codegen_1$9._ `${len} > ${i}`, () => cxt.subschema({
              keyword,
              schemaProp: i,
              dataProp: i,
          }, valid));
          cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
          const { opts, errSchemaPath } = it;
          const l = schArr.length;
          const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
          if (opts.strictTuples && !fullTuple) {
              const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
              util_1$b.checkStrictMode(it, msg, opts.strictTuples);
          }
      }
  }
  items.validateTuple = validateTuple;
  items.default = def$f;

  Object.defineProperty(prefixItems, "__esModule", { value: true });
  const items_1$1 = items;
  const def$e = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => items_1$1.validateTuple(cxt, "items"),
  };
  prefixItems.default = def$e;

  var items2020 = {};

  Object.defineProperty(items2020, "__esModule", { value: true });
  const codegen_1$8 = codegen;
  const util_1$a = util;
  const code_1$4 = code;
  const additionalItems_1$1 = additionalItems;
  const error$7 = {
      message: ({ params: { len } }) => codegen_1$8.str `must NOT have more than ${len} items`,
      params: ({ params: { len } }) => codegen_1$8._ `{limit: ${len}}`,
  };
  const def$d = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error: error$7,
      code(cxt) {
          const { schema, parentSchema, it } = cxt;
          const { prefixItems } = parentSchema;
          it.items = true;
          if (util_1$a.alwaysValidSchema(it, schema))
              return;
          if (prefixItems)
              additionalItems_1$1.validateAdditionalItems(cxt, prefixItems);
          else
              cxt.ok(code_1$4.validateArray(cxt));
      },
  };
  items2020.default = def$d;

  var contains = {};

  Object.defineProperty(contains, "__esModule", { value: true });
  const codegen_1$7 = codegen;
  const util_1$9 = util;
  const error$6 = {
      message: ({ params: { min, max } }) => max === undefined
          ? codegen_1$7.str `must contain at least ${min} valid item(s)`
          : codegen_1$7.str `must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === undefined ? codegen_1$7._ `{minContains: ${min}}` : codegen_1$7._ `{minContains: ${min}, maxContains: ${max}}`,
  };
  const def$c = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error: error$6,
      code(cxt) {
          const { gen, schema, parentSchema, data, it } = cxt;
          let min;
          let max;
          const { minContains, maxContains } = parentSchema;
          if (it.opts.next) {
              min = minContains === undefined ? 1 : minContains;
              max = maxContains;
          }
          else {
              min = 1;
          }
          const len = gen.const("len", codegen_1$7._ `${data}.length`);
          cxt.setParams({ min, max });
          if (max === undefined && min === 0) {
              util_1$9.checkStrictMode(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
              return;
          }
          if (max !== undefined && min > max) {
              util_1$9.checkStrictMode(it, `"minContains" > "maxContains" is always invalid`);
              cxt.fail();
              return;
          }
          if (util_1$9.alwaysValidSchema(it, schema)) {
              let cond = codegen_1$7._ `${len} >= ${min}`;
              if (max !== undefined)
                  cond = codegen_1$7._ `${cond} && ${len} <= ${max}`;
              cxt.pass(cond);
              return;
          }
          it.items = true;
          const valid = gen.name("valid");
          if (max === undefined && min === 1) {
              validateItems(valid, () => gen.if(valid, () => gen.break()));
          }
          else {
              gen.let(valid, false);
              const schValid = gen.name("_valid");
              const count = gen.let("count", 0);
              validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
          }
          cxt.result(valid, () => cxt.reset());
          function validateItems(_valid, block) {
              gen.forRange("i", 0, len, (i) => {
                  cxt.subschema({
                      keyword: "contains",
                      dataProp: i,
                      dataPropType: util_1$9.Type.Num,
                      compositeRule: true,
                  }, _valid);
                  block();
              });
          }
          function checkLimits(count) {
              gen.code(codegen_1$7._ `${count}++`);
              if (max === undefined) {
                  gen.if(codegen_1$7._ `${count} >= ${min}`, () => gen.assign(valid, true).break());
              }
              else {
                  gen.if(codegen_1$7._ `${count} > ${max}`, () => gen.assign(valid, false).break());
                  if (min === 1)
                      gen.assign(valid, true);
                  else
                      gen.if(codegen_1$7._ `${count} >= ${min}`, () => gen.assign(valid, true));
              }
          }
      },
  };
  contains.default = def$c;

  var dependencies = {};

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
  const codegen_1 = codegen;
  const util_1 = util;
  const code_1 = code;
  exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
          const property_ies = depsCount === 1 ? "property" : "properties";
          return codegen_1.str `must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => codegen_1._ `{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`, // TODO change to reference
  };
  const def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
          const [propDeps, schDeps] = splitDependencies(cxt);
          validatePropertyDeps(cxt, propDeps);
          validateSchemaDeps(cxt, schDeps);
      },
  };
  function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
          if (key === "__proto__")
              continue;
          const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
          deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
  }
  function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
          return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
          const deps = propertyDeps[prop];
          if (deps.length === 0)
              continue;
          const hasProperty = code_1.propertyInData(gen, data, prop, it.opts.ownProperties);
          cxt.setParams({
              property: prop,
              depsCount: deps.length,
              deps: deps.join(", "),
          });
          if (it.allErrors) {
              gen.if(hasProperty, () => {
                  for (const depProp of deps) {
                      code_1.checkReportMissingProp(cxt, depProp);
                  }
              });
          }
          else {
              gen.if(codegen_1._ `${hasProperty} && (${code_1.checkMissingProp(cxt, deps, missing)})`);
              code_1.reportMissingProp(cxt, missing);
              gen.else();
          }
      }
  }
  exports.validatePropertyDeps = validatePropertyDeps;
  function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
          if (util_1.alwaysValidSchema(it, schemaDeps[prop]))
              continue;
          gen.if(code_1.propertyInData(gen, data, prop, it.opts.ownProperties), () => {
              const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
              cxt.mergeValidEvaluated(schCxt, valid);
          }, () => gen.var(valid, true) // TODO var
          );
          cxt.ok(valid);
      }
  }
  exports.validateSchemaDeps = validateSchemaDeps;
  exports.default = def;

  }(dependencies));

  var propertyNames = {};

  Object.defineProperty(propertyNames, "__esModule", { value: true });
  const codegen_1$6 = codegen;
  const util_1$8 = util;
  const error$5 = {
      message: "property name must be valid",
      params: ({ params }) => codegen_1$6._ `{propertyName: ${params.propertyName}}`,
  };
  const def$b = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error: error$5,
      code(cxt) {
          const { gen, schema, data, it } = cxt;
          if (util_1$8.alwaysValidSchema(it, schema))
              return;
          const valid = gen.name("valid");
          gen.forIn("key", data, (key) => {
              cxt.setParams({ propertyName: key });
              cxt.subschema({
                  keyword: "propertyNames",
                  data: key,
                  dataTypes: ["string"],
                  propertyName: key,
                  compositeRule: true,
              }, valid);
              gen.if(codegen_1$6.not(valid), () => {
                  cxt.error(true);
                  if (!it.allErrors)
                      gen.break();
              });
          });
          cxt.ok(valid);
      },
  };
  propertyNames.default = def$b;

  var additionalProperties = {};

  Object.defineProperty(additionalProperties, "__esModule", { value: true });
  const code_1$3 = code;
  const codegen_1$5 = codegen;
  const names_1 = names$1;
  const util_1$7 = util;
  const error$4 = {
      message: "must NOT have additional properties",
      params: ({ params }) => codegen_1$5._ `{additionalProperty: ${params.additionalProperty}}`,
  };
  const def$a = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error: error$4,
      code(cxt) {
          const { gen, schema, parentSchema, data, errsCount, it } = cxt;
          /* istanbul ignore if */
          if (!errsCount)
              throw new Error("ajv implementation error");
          const { allErrors, opts } = it;
          it.props = true;
          if (opts.removeAdditional !== "all" && util_1$7.alwaysValidSchema(it, schema))
              return;
          const props = code_1$3.allSchemaProperties(parentSchema.properties);
          const patProps = code_1$3.allSchemaProperties(parentSchema.patternProperties);
          checkAdditionalProperties();
          cxt.ok(codegen_1$5._ `${errsCount} === ${names_1.default.errors}`);
          function checkAdditionalProperties() {
              gen.forIn("key", data, (key) => {
                  if (!props.length && !patProps.length)
                      additionalPropertyCode(key);
                  else
                      gen.if(isAdditional(key), () => additionalPropertyCode(key));
              });
          }
          function isAdditional(key) {
              let definedProp;
              if (props.length > 8) {
                  // TODO maybe an option instead of hard-coded 8?
                  const propsSchema = util_1$7.schemaRefOrVal(it, parentSchema.properties, "properties");
                  definedProp = code_1$3.isOwnProperty(gen, propsSchema, key);
              }
              else if (props.length) {
                  definedProp = codegen_1$5.or(...props.map((p) => codegen_1$5._ `${key} === ${p}`));
              }
              else {
                  definedProp = codegen_1$5.nil;
              }
              if (patProps.length) {
                  definedProp = codegen_1$5.or(definedProp, ...patProps.map((p) => codegen_1$5._ `${code_1$3.usePattern(cxt, p)}.test(${key})`));
              }
              return codegen_1$5.not(definedProp);
          }
          function deleteAdditional(key) {
              gen.code(codegen_1$5._ `delete ${data}[${key}]`);
          }
          function additionalPropertyCode(key) {
              if (opts.removeAdditional === "all" || (opts.removeAdditional && schema === false)) {
                  deleteAdditional(key);
                  return;
              }
              if (schema === false) {
                  cxt.setParams({ additionalProperty: key });
                  cxt.error();
                  if (!allErrors)
                      gen.break();
                  return;
              }
              if (typeof schema == "object" && !util_1$7.alwaysValidSchema(it, schema)) {
                  const valid = gen.name("valid");
                  if (opts.removeAdditional === "failing") {
                      applyAdditionalSchema(key, valid, false);
                      gen.if(codegen_1$5.not(valid), () => {
                          cxt.reset();
                          deleteAdditional(key);
                      });
                  }
                  else {
                      applyAdditionalSchema(key, valid);
                      if (!allErrors)
                          gen.if(codegen_1$5.not(valid), () => gen.break());
                  }
              }
          }
          function applyAdditionalSchema(key, valid, errors) {
              const subschema = {
                  keyword: "additionalProperties",
                  dataProp: key,
                  dataPropType: util_1$7.Type.Str,
              };
              if (errors === false) {
                  Object.assign(subschema, {
                      compositeRule: true,
                      createErrors: false,
                      allErrors: false,
                  });
              }
              cxt.subschema(subschema, valid);
          }
      },
  };
  additionalProperties.default = def$a;

  var properties$2 = {};

  Object.defineProperty(properties$2, "__esModule", { value: true });
  const validate_1 = validate$1;
  const code_1$2 = code;
  const util_1$6 = util;
  const additionalProperties_1$1 = additionalProperties;
  const def$9 = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
          const { gen, schema, parentSchema, data, it } = cxt;
          if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === undefined) {
              additionalProperties_1$1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1$1.default, "additionalProperties"));
          }
          const allProps = code_1$2.allSchemaProperties(schema);
          for (const prop of allProps) {
              it.definedProperties.add(prop);
          }
          if (it.opts.unevaluated && allProps.length && it.props !== true) {
              it.props = util_1$6.mergeEvaluated.props(gen, util_1$6.toHash(allProps), it.props);
          }
          const properties = allProps.filter((p) => !util_1$6.alwaysValidSchema(it, schema[p]));
          if (properties.length === 0)
              return;
          const valid = gen.name("valid");
          for (const prop of properties) {
              if (hasDefault(prop)) {
                  applyPropertySchema(prop);
              }
              else {
                  gen.if(code_1$2.propertyInData(gen, data, prop, it.opts.ownProperties));
                  applyPropertySchema(prop);
                  if (!it.allErrors)
                      gen.else().var(valid, true);
                  gen.endIf();
              }
              cxt.it.definedProperties.add(prop);
              cxt.ok(valid);
          }
          function hasDefault(prop) {
              return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== undefined;
          }
          function applyPropertySchema(prop) {
              cxt.subschema({
                  keyword: "properties",
                  schemaProp: prop,
                  dataProp: prop,
              }, valid);
          }
      },
  };
  properties$2.default = def$9;

  var patternProperties = {};

  Object.defineProperty(patternProperties, "__esModule", { value: true });
  const code_1$1 = code;
  const codegen_1$4 = codegen;
  const util_1$5 = util;
  const util_2 = util;
  const def$8 = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
          const { gen, schema, data, parentSchema, it } = cxt;
          const { opts } = it;
          const patterns = code_1$1.allSchemaProperties(schema);
          const alwaysValidPatterns = patterns.filter((p) => util_1$5.alwaysValidSchema(it, schema[p]));
          if (patterns.length === 0 ||
              (alwaysValidPatterns.length === patterns.length &&
                  (!it.opts.unevaluated || it.props === true))) {
              return;
          }
          const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
          const valid = gen.name("valid");
          if (it.props !== true && !(it.props instanceof codegen_1$4.Name)) {
              it.props = util_2.evaluatedPropsToName(gen, it.props);
          }
          const { props } = it;
          validatePatternProperties();
          function validatePatternProperties() {
              for (const pat of patterns) {
                  if (checkProperties)
                      checkMatchingProperties(pat);
                  if (it.allErrors) {
                      validateProperties(pat);
                  }
                  else {
                      gen.var(valid, true); // TODO var
                      validateProperties(pat);
                      gen.if(valid);
                  }
              }
          }
          function checkMatchingProperties(pat) {
              for (const prop in checkProperties) {
                  if (new RegExp(pat).test(prop)) {
                      util_1$5.checkStrictMode(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
                  }
              }
          }
          function validateProperties(pat) {
              gen.forIn("key", data, (key) => {
                  gen.if(codegen_1$4._ `${code_1$1.usePattern(cxt, pat)}.test(${key})`, () => {
                      const alwaysValid = alwaysValidPatterns.includes(pat);
                      if (!alwaysValid) {
                          cxt.subschema({
                              keyword: "patternProperties",
                              schemaProp: pat,
                              dataProp: key,
                              dataPropType: util_2.Type.Str,
                          }, valid);
                      }
                      if (it.opts.unevaluated && props !== true) {
                          gen.assign(codegen_1$4._ `${props}[${key}]`, true);
                      }
                      else if (!alwaysValid && !it.allErrors) {
                          // can short-circuit if `unevaluatedProperties` is not supported (opts.next === false)
                          // or if all properties were evaluated (props === true)
                          gen.if(codegen_1$4.not(valid), () => gen.break());
                      }
                  });
              });
          }
      },
  };
  patternProperties.default = def$8;

  var not = {};

  Object.defineProperty(not, "__esModule", { value: true });
  const util_1$4 = util;
  const def$7 = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
          const { gen, schema, it } = cxt;
          if (util_1$4.alwaysValidSchema(it, schema)) {
              cxt.fail();
              return;
          }
          const valid = gen.name("valid");
          cxt.subschema({
              keyword: "not",
              compositeRule: true,
              createErrors: false,
              allErrors: false,
          }, valid);
          cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" },
  };
  not.default = def$7;

  var anyOf = {};

  Object.defineProperty(anyOf, "__esModule", { value: true });
  const code_1 = code;
  const def$6 = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" },
  };
  anyOf.default = def$6;

  var oneOf$1 = {};

  Object.defineProperty(oneOf$1, "__esModule", { value: true });
  const codegen_1$3 = codegen;
  const util_1$3 = util;
  const error$3 = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => codegen_1$3._ `{passingSchemas: ${params.passing}}`,
  };
  const def$5 = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error: error$3,
      code(cxt) {
          const { gen, schema, parentSchema, it } = cxt;
          /* istanbul ignore if */
          if (!Array.isArray(schema))
              throw new Error("ajv implementation error");
          if (it.opts.discriminator && parentSchema.discriminator)
              return;
          const schArr = schema;
          const valid = gen.let("valid", false);
          const passing = gen.let("passing", null);
          const schValid = gen.name("_valid");
          cxt.setParams({ passing });
          // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
          gen.block(validateOneOf);
          cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
          function validateOneOf() {
              schArr.forEach((sch, i) => {
                  let schCxt;
                  if (util_1$3.alwaysValidSchema(it, sch)) {
                      gen.var(schValid, true);
                  }
                  else {
                      schCxt = cxt.subschema({
                          keyword: "oneOf",
                          schemaProp: i,
                          compositeRule: true,
                      }, schValid);
                  }
                  if (i > 0) {
                      gen
                          .if(codegen_1$3._ `${schValid} && ${valid}`)
                          .assign(valid, false)
                          .assign(passing, codegen_1$3._ `[${passing}, ${i}]`)
                          .else();
                  }
                  gen.if(schValid, () => {
                      gen.assign(valid, true);
                      gen.assign(passing, i);
                      if (schCxt)
                          cxt.mergeEvaluated(schCxt, codegen_1$3.Name);
                  });
              });
          }
      },
  };
  oneOf$1.default = def$5;

  var allOf = {};

  Object.defineProperty(allOf, "__esModule", { value: true });
  const util_1$2 = util;
  const def$4 = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
          const { gen, schema, it } = cxt;
          /* istanbul ignore if */
          if (!Array.isArray(schema))
              throw new Error("ajv implementation error");
          const valid = gen.name("valid");
          schema.forEach((sch, i) => {
              if (util_1$2.alwaysValidSchema(it, sch))
                  return;
              const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
              cxt.ok(valid);
              cxt.mergeEvaluated(schCxt);
          });
      },
  };
  allOf.default = def$4;

  var _if = {};

  Object.defineProperty(_if, "__esModule", { value: true });
  const codegen_1$2 = codegen;
  const util_1$1 = util;
  const error$2 = {
      message: ({ params }) => codegen_1$2.str `must match "${params.ifClause}" schema`,
      params: ({ params }) => codegen_1$2._ `{failingKeyword: ${params.ifClause}}`,
  };
  const def$3 = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error: error$2,
      code(cxt) {
          const { gen, parentSchema, it } = cxt;
          if (parentSchema.then === undefined && parentSchema.else === undefined) {
              util_1$1.checkStrictMode(it, '"if" without "then" and "else" is ignored');
          }
          const hasThen = hasSchema(it, "then");
          const hasElse = hasSchema(it, "else");
          if (!hasThen && !hasElse)
              return;
          const valid = gen.let("valid", true);
          const schValid = gen.name("_valid");
          validateIf();
          cxt.reset();
          if (hasThen && hasElse) {
              const ifClause = gen.let("ifClause");
              cxt.setParams({ ifClause });
              gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
          }
          else if (hasThen) {
              gen.if(schValid, validateClause("then"));
          }
          else {
              gen.if(codegen_1$2.not(schValid), validateClause("else"));
          }
          cxt.pass(valid, () => cxt.error(true));
          function validateIf() {
              const schCxt = cxt.subschema({
                  keyword: "if",
                  compositeRule: true,
                  createErrors: false,
                  allErrors: false,
              }, schValid);
              cxt.mergeEvaluated(schCxt);
          }
          function validateClause(keyword, ifClause) {
              return () => {
                  const schCxt = cxt.subschema({ keyword }, schValid);
                  gen.assign(valid, schValid);
                  cxt.mergeValidEvaluated(schCxt, valid);
                  if (ifClause)
                      gen.assign(ifClause, codegen_1$2._ `${keyword}`);
                  else
                      cxt.setParams({ ifClause: keyword });
              };
          }
      },
  };
  function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== undefined && !util_1$1.alwaysValidSchema(it, schema);
  }
  _if.default = def$3;

  var thenElse = {};

  Object.defineProperty(thenElse, "__esModule", { value: true });
  const util_1 = util;
  const def$2 = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
          if (parentSchema.if === undefined)
              util_1.checkStrictMode(it, `"${keyword}" without "if" is ignored`);
      },
  };
  thenElse.default = def$2;

  Object.defineProperty(applicator, "__esModule", { value: true });
  const additionalItems_1 = additionalItems;
  const prefixItems_1 = prefixItems;
  const items_1 = items;
  const items2020_1 = items2020;
  const contains_1 = contains;
  const dependencies_1 = dependencies;
  const propertyNames_1 = propertyNames;
  const additionalProperties_1 = additionalProperties;
  const properties_1 = properties$2;
  const patternProperties_1 = patternProperties;
  const not_1 = not;
  const anyOf_1 = anyOf;
  const oneOf_1 = oneOf$1;
  const allOf_1 = allOf;
  const if_1 = _if;
  const thenElse_1 = thenElse;
  function getApplicator(draft2020 = false) {
      const applicator = [
          // any
          not_1.default,
          anyOf_1.default,
          oneOf_1.default,
          allOf_1.default,
          if_1.default,
          thenElse_1.default,
          // object
          propertyNames_1.default,
          additionalProperties_1.default,
          dependencies_1.default,
          properties_1.default,
          patternProperties_1.default,
      ];
      // array
      if (draft2020)
          applicator.push(prefixItems_1.default, items2020_1.default);
      else
          applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
  }
  applicator.default = getApplicator;

  var format$2 = {};

  var format$1 = {};

  Object.defineProperty(format$1, "__esModule", { value: true });
  const codegen_1$1 = codegen;
  const error$1 = {
      message: ({ schemaCode }) => codegen_1$1.str `must match format "${schemaCode}"`,
      params: ({ schemaCode }) => codegen_1$1._ `{format: ${schemaCode}}`,
  };
  const def$1 = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error: error$1,
      code(cxt, ruleType) {
          const { gen, data, $data, schema, schemaCode, it } = cxt;
          const { opts, errSchemaPath, schemaEnv, self } = it;
          if (!opts.validateFormats)
              return;
          if ($data)
              validate$DataFormat();
          else
              validateFormat();
          function validate$DataFormat() {
              const fmts = gen.scopeValue("formats", {
                  ref: self.formats,
                  code: opts.code.formats,
              });
              const fDef = gen.const("fDef", codegen_1$1._ `${fmts}[${schemaCode}]`);
              const fType = gen.let("fType");
              const format = gen.let("format");
              // TODO simplify
              gen.if(codegen_1$1._ `typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, codegen_1$1._ `${fDef}.type || "string"`).assign(format, codegen_1$1._ `${fDef}.validate`), () => gen.assign(fType, codegen_1$1._ `"string"`).assign(format, fDef));
              cxt.fail$data(codegen_1$1.or(unknownFmt(), invalidFmt()));
              function unknownFmt() {
                  if (opts.strictSchema === false)
                      return codegen_1$1.nil;
                  return codegen_1$1._ `${schemaCode} && !${format}`;
              }
              function invalidFmt() {
                  const callFormat = schemaEnv.$async
                      ? codegen_1$1._ `(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))`
                      : codegen_1$1._ `${format}(${data})`;
                  const validData = codegen_1$1._ `(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
                  return codegen_1$1._ `${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
              }
          }
          function validateFormat() {
              const formatDef = self.formats[schema];
              if (!formatDef) {
                  unknownFormat();
                  return;
              }
              if (formatDef === true)
                  return;
              const [fmtType, format, fmtRef] = getFormat(formatDef);
              if (fmtType === ruleType)
                  cxt.pass(validCondition());
              function unknownFormat() {
                  if (opts.strictSchema === false) {
                      self.logger.warn(unknownMsg());
                      return;
                  }
                  throw new Error(unknownMsg());
                  function unknownMsg() {
                      return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
                  }
              }
              function getFormat(fmtDef) {
                  const code = fmtDef instanceof RegExp
                      ? codegen_1$1.regexpCode(fmtDef)
                      : opts.code.formats
                          ? codegen_1$1._ `${opts.code.formats}${codegen_1$1.getProperty(schema)}`
                          : undefined;
                  const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
                  if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
                      return [fmtDef.type || "string", fmtDef.validate, codegen_1$1._ `${fmt}.validate`];
                  }
                  return ["string", fmtDef, fmt];
              }
              function validCondition() {
                  if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
                      if (!schemaEnv.$async)
                          throw new Error("async format in sync schema");
                      return codegen_1$1._ `await ${fmtRef}(${data})`;
                  }
                  return typeof format == "function" ? codegen_1$1._ `${fmtRef}(${data})` : codegen_1$1._ `${fmtRef}.test(${data})`;
              }
          }
      },
  };
  format$1.default = def$1;

  Object.defineProperty(format$2, "__esModule", { value: true });
  const format_1$1 = format$1;
  const format = [format_1$1.default];
  format$2.default = format;

  var metadata = {};

  Object.defineProperty(metadata, "__esModule", { value: true });
  metadata.contentVocabulary = metadata.metadataVocabulary = void 0;
  metadata.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples",
  ];
  metadata.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema",
  ];

  Object.defineProperty(draft7, "__esModule", { value: true });
  const core_1 = core$2;
  const validation_1 = validation$1;
  const applicator_1 = applicator;
  const format_1 = format$2;
  const metadata_1 = metadata;
  const draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      applicator_1.default(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
  ];
  draft7.default = draft7Vocabularies;

  var discriminator = {};

  var types = {};

  (function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DiscrError = void 0;
  (function (DiscrError) {
      DiscrError["Tag"] = "tag";
      DiscrError["Mapping"] = "mapping";
  })(exports.DiscrError || (exports.DiscrError = {}));

  }(types));

  Object.defineProperty(discriminator, "__esModule", { value: true });
  const codegen_1 = codegen;
  const types_1 = types;
  const error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag
          ? `tag "${tagName}" must be string`
          : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => codegen_1._ `{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`,
  };
  const def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
          const { gen, data, schema, parentSchema, it } = cxt;
          const { oneOf } = parentSchema;
          if (!it.opts.discriminator) {
              throw new Error("discriminator: requires discriminator option");
          }
          const tagName = schema.propertyName;
          if (typeof tagName != "string")
              throw new Error("discriminator: requires propertyName");
          if (schema.mapping)
              throw new Error("discriminator: mapping is not supported");
          if (!oneOf)
              throw new Error("discriminator: requires oneOf keyword");
          const valid = gen.let("valid", false);
          const tag = gen.const("tag", codegen_1._ `${data}${codegen_1.getProperty(tagName)}`);
          gen.if(codegen_1._ `typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
          cxt.ok(valid);
          function validateMapping() {
              const mapping = getMapping();
              gen.if(false);
              for (const tagValue in mapping) {
                  gen.elseIf(codegen_1._ `${tag} === ${tagValue}`);
                  gen.assign(valid, applyTagSchema(mapping[tagValue]));
              }
              gen.else();
              cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
              gen.endIf();
          }
          function applyTagSchema(schemaProp) {
              const _valid = gen.name("valid");
              const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
              cxt.mergeEvaluated(schCxt, codegen_1.Name);
              return _valid;
          }
          function getMapping() {
              var _a;
              const oneOfMapping = {};
              const topRequired = hasRequired(parentSchema);
              let tagRequired = true;
              for (let i = 0; i < oneOf.length; i++) {
                  const sch = oneOf[i];
                  const propSch = (_a = sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
                  if (typeof propSch != "object") {
                      throw new Error(`discriminator: oneOf schemas must have "properties/${tagName}"`);
                  }
                  tagRequired = tagRequired && (topRequired || hasRequired(sch));
                  addMappings(propSch, i);
              }
              if (!tagRequired)
                  throw new Error(`discriminator: "${tagName}" must be required`);
              return oneOfMapping;
              function hasRequired({ required }) {
                  return Array.isArray(required) && required.includes(tagName);
              }
              function addMappings(sch, i) {
                  if (sch.const) {
                      addMapping(sch.const, i);
                  }
                  else if (sch.enum) {
                      for (const tagValue of sch.enum) {
                          addMapping(tagValue, i);
                      }
                  }
                  else {
                      throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
                  }
              }
              function addMapping(tagValue, i) {
                  if (typeof tagValue != "string" || tagValue in oneOfMapping) {
                      throw new Error(`discriminator: "${tagName}" values must be unique strings`);
                  }
                  oneOfMapping[tagValue] = i;
              }
          }
      },
  };
  discriminator.default = def;

  var $schema$9 = "http://json-schema.org/draft-07/schema#";
  var $id$9 = "http://json-schema.org/draft-07/schema#";
  var title = "Core schema meta-schema";
  var definitions$8 = {
  	schemaArray: {
  		type: "array",
  		minItems: 1,
  		items: {
  			$ref: "#"
  		}
  	},
  	nonNegativeInteger: {
  		type: "integer",
  		minimum: 0
  	},
  	nonNegativeIntegerDefault0: {
  		allOf: [
  			{
  				$ref: "#/definitions/nonNegativeInteger"
  			},
  			{
  				"default": 0
  			}
  		]
  	},
  	simpleTypes: {
  		"enum": [
  			"array",
  			"boolean",
  			"integer",
  			"null",
  			"number",
  			"object",
  			"string"
  		]
  	},
  	stringArray: {
  		type: "array",
  		items: {
  			type: "string"
  		},
  		uniqueItems: true,
  		"default": [
  		]
  	}
  };
  var type$a = [
  	"object",
  	"boolean"
  ];
  var properties$1 = {
  	$id: {
  		type: "string",
  		format: "uri-reference"
  	},
  	$schema: {
  		type: "string",
  		format: "uri"
  	},
  	$ref: {
  		type: "string",
  		format: "uri-reference"
  	},
  	$comment: {
  		type: "string"
  	},
  	title: {
  		type: "string"
  	},
  	description: {
  		type: "string"
  	},
  	"default": true,
  	readOnly: {
  		type: "boolean",
  		"default": false
  	},
  	examples: {
  		type: "array",
  		items: true
  	},
  	multipleOf: {
  		type: "number",
  		exclusiveMinimum: 0
  	},
  	maximum: {
  		type: "number"
  	},
  	exclusiveMaximum: {
  		type: "number"
  	},
  	minimum: {
  		type: "number"
  	},
  	exclusiveMinimum: {
  		type: "number"
  	},
  	maxLength: {
  		$ref: "#/definitions/nonNegativeInteger"
  	},
  	minLength: {
  		$ref: "#/definitions/nonNegativeIntegerDefault0"
  	},
  	pattern: {
  		type: "string",
  		format: "regex"
  	},
  	additionalItems: {
  		$ref: "#"
  	},
  	items: {
  		anyOf: [
  			{
  				$ref: "#"
  			},
  			{
  				$ref: "#/definitions/schemaArray"
  			}
  		],
  		"default": true
  	},
  	maxItems: {
  		$ref: "#/definitions/nonNegativeInteger"
  	},
  	minItems: {
  		$ref: "#/definitions/nonNegativeIntegerDefault0"
  	},
  	uniqueItems: {
  		type: "boolean",
  		"default": false
  	},
  	contains: {
  		$ref: "#"
  	},
  	maxProperties: {
  		$ref: "#/definitions/nonNegativeInteger"
  	},
  	minProperties: {
  		$ref: "#/definitions/nonNegativeIntegerDefault0"
  	},
  	required: {
  		$ref: "#/definitions/stringArray"
  	},
  	additionalProperties: {
  		$ref: "#"
  	},
  	definitions: {
  		type: "object",
  		additionalProperties: {
  			$ref: "#"
  		},
  		"default": {
  		}
  	},
  	properties: {
  		type: "object",
  		additionalProperties: {
  			$ref: "#"
  		},
  		"default": {
  		}
  	},
  	patternProperties: {
  		type: "object",
  		additionalProperties: {
  			$ref: "#"
  		},
  		propertyNames: {
  			format: "regex"
  		},
  		"default": {
  		}
  	},
  	dependencies: {
  		type: "object",
  		additionalProperties: {
  			anyOf: [
  				{
  					$ref: "#"
  				},
  				{
  					$ref: "#/definitions/stringArray"
  				}
  			]
  		}
  	},
  	propertyNames: {
  		$ref: "#"
  	},
  	"const": true,
  	"enum": {
  		type: "array",
  		items: true,
  		minItems: 1,
  		uniqueItems: true
  	},
  	type: {
  		anyOf: [
  			{
  				$ref: "#/definitions/simpleTypes"
  			},
  			{
  				type: "array",
  				items: {
  					$ref: "#/definitions/simpleTypes"
  				},
  				minItems: 1,
  				uniqueItems: true
  			}
  		]
  	},
  	format: {
  		type: "string"
  	},
  	contentMediaType: {
  		type: "string"
  	},
  	contentEncoding: {
  		type: "string"
  	},
  	"if": {
  		$ref: "#"
  	},
  	then: {
  		$ref: "#"
  	},
  	"else": {
  		$ref: "#"
  	},
  	allOf: {
  		$ref: "#/definitions/schemaArray"
  	},
  	anyOf: {
  		$ref: "#/definitions/schemaArray"
  	},
  	oneOf: {
  		$ref: "#/definitions/schemaArray"
  	},
  	not: {
  		$ref: "#"
  	}
  };
  var require$$3 = {
  	$schema: $schema$9,
  	$id: $id$9,
  	title: title,
  	definitions: definitions$8,
  	type: type$a,
  	properties: properties$1,
  	"default": true
  };

  (function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
  const core_1 = core$3;
  const draft7_1 = draft7;
  const discriminator_1 = discriminator;
  const draft7MetaSchema = require$$3;
  const META_SUPPORT_DATA = ["/properties"];
  const META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
  class Ajv extends core_1.default {
      _addVocabularies() {
          super._addVocabularies();
          draft7_1.default.forEach((v) => this.addVocabulary(v));
          if (this.opts.discriminator)
              this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
          super._addDefaultMetaSchema();
          if (!this.opts.meta)
              return;
          const metaSchema = this.opts.$data
              ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA)
              : draft7MetaSchema;
          this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
          this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
          return (this.opts.defaultMeta =
              super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : undefined));
      }
  }
  module.exports = exports = Ajv;
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = Ajv;
  var validate_1 = validate$1;
  Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
  var codegen_1 = codegen;
  Object.defineProperty(exports, "_", { enumerable: true, get: function () { return codegen_1._; } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
  Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });

  }(ajv$1, ajv$1.exports));

  var Ajv = /*@__PURE__*/getDefaultExportFromCjs(ajv$1.exports);

  var $id$8 = "https://serverlessworkflow.io/schemas/0.7/auth.json";
  var $schema$8 = "http://json-schema.org/draft-07/schema#";
  var description$8 = "Serverless Workflow specification - auth schema";
  var type$9 = "object";
  var auth = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing auth definitions (json or yaml)"
  		},
  		{
  			type: "array",
  			description: "Workflow auth definitions",
  			items: {
  				type: "object",
  				$ref: "#/definitions/authdef"
  			},
  			additionalItems: false,
  			minItems: 1
  		}
  	]
  };
  var required$6 = [
  	"auth"
  ];
  var definitions$7 = {
  	authdef: {
  		type: "object",
  		properties: {
  			name: {
  				type: "string",
  				description: "Unique auth definition name",
  				minLength: 1
  			},
  			scheme: {
  				type: "string",
  				description: "Defines the auth type",
  				"enum": [
  					"basic",
  					"bearer",
  					"oauth2"
  				],
  				"default": "basic"
  			},
  			properties: {
  				oneOf: [
  					{
  						type: "string",
  						description: "Expression referencing a workflow secret that contains all needed auth info"
  					},
  					{
  						title: "Basic Auth Info",
  						$ref: "#/definitions/basicpropsdef"
  					},
  					{
  						title: "Bearer Auth Info State",
  						$ref: "#/definitions/bearerpropsdef"
  					},
  					{
  						title: "OAuth2  Info",
  						$ref: "#/definitions/oauth2propsdef"
  					}
  				]
  			}
  		},
  		required: [
  			"name",
  			"properties"
  		]
  	},
  	basicpropsdef: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Expression referencing a workflow secret that contains all needed basic auth info"
  			},
  			{
  				type: "object",
  				description: "Basic auth information",
  				properties: {
  					username: {
  						type: "string",
  						description: "String or a workflow expression. Contains the user name",
  						minLength: 1
  					},
  					password: {
  						type: "string",
  						description: "String or a workflow expression. Contains the user password",
  						minLength: 1
  					},
  					metadata: {
  						$ref: "common.json#/definitions/metadata"
  					}
  				},
  				required: [
  					"username",
  					"password"
  				],
  				additionalProperties: false
  			}
  		]
  	},
  	bearerpropsdef: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Expression referencing a workflow secret that contains all needed bearer auth info"
  			},
  			{
  				type: "object",
  				description: "Bearer auth information",
  				properties: {
  					token: {
  						type: "string",
  						description: "String or a workflow expression. Contains the token",
  						minLength: 1
  					},
  					metadata: {
  						$ref: "common.json#/definitions/metadata"
  					}
  				},
  				required: [
  					"token"
  				],
  				additionalProperties: false
  			}
  		]
  	},
  	oauth2propsdef: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Expression referencing a workflow secret that contains all needed OAuth2 auth info"
  			},
  			{
  				type: "object",
  				description: "OAuth2 information",
  				properties: {
  					authority: {
  						type: "string",
  						description: "String or a workflow expression. Contains the authority information",
  						minLength: 1
  					},
  					grantType: {
  						type: "string",
  						description: "Defines the grant type",
  						"enum": [
  							"password",
  							"clientCredentials",
  							"tokenExchange"
  						],
  						additionalItems: false
  					},
  					clientId: {
  						type: "string",
  						description: "String or a workflow expression. Contains the client identifier",
  						minLength: 1
  					},
  					clientSecret: {
  						type: "string",
  						description: "Workflow secret or a workflow expression. Contains the client secret",
  						minLength: 1
  					},
  					scopes: {
  						type: "array",
  						description: "Array containing strings or workflow expressions. Contains the OAuth2 scopes",
  						items: {
  							type: "string"
  						},
  						minItems: 1,
  						additionalItems: false
  					},
  					username: {
  						type: "string",
  						description: "String or a workflow expression. Contains the user name. Used only if grantType is 'resourceOwner'",
  						minLength: 1
  					},
  					password: {
  						type: "string",
  						description: "String or a workflow expression. Contains the user password. Used only if grantType is 'resourceOwner'",
  						minLength: 1
  					},
  					audiences: {
  						type: "array",
  						description: "Array containing strings or workflow expressions. Contains the OAuth2 audiences",
  						items: {
  							type: "string"
  						},
  						minItems: 1,
  						additionalItems: false
  					},
  					subjectToken: {
  						type: "string",
  						description: "String or a workflow expression. Contains the subject token",
  						minLength: 1
  					},
  					requestedSubject: {
  						type: "string",
  						description: "String or a workflow expression. Contains the requested subject",
  						minLength: 1
  					},
  					requestedIssuer: {
  						type: "string",
  						description: "String or a workflow expression. Contains the requested issuer",
  						minLength: 1
  					},
  					metadata: {
  						$ref: "common.json#/definitions/metadata"
  					}
  				},
  				required: [
  					"grantType",
  					"clientId"
  				]
  			}
  		]
  	}
  };
  var authSchema = {
  	$id: $id$8,
  	$schema: $schema$8,
  	description: description$8,
  	type: type$9,
  	auth: auth,
  	required: required$6,
  	definitions: definitions$7
  };

  var $id$7 = "https://serverlessworkflow.io/schemas/0.7/common.json";
  var $schema$7 = "http://json-schema.org/draft-07/schema#";
  var description$7 = "Serverless Workflow specification - common schema";
  var type$8 = "object";
  var definitions$6 = {
  	metadata: {
  		type: "object",
  		description: "Metadata information",
  		additionalProperties: {
  			type: "string"
  		}
  	}
  };
  var commonSchema = {
  	$id: $id$7,
  	$schema: $schema$7,
  	description: description$7,
  	type: type$8,
  	definitions: definitions$6
  };

  var $id$6 = "https://serverlessworkflow.io/schemas/0.7/errors.json";
  var $schema$6 = "http://json-schema.org/draft-07/schema#";
  var description$6 = "Serverless Workflow specification - errors schema";
  var type$7 = "object";
  var errors = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing error definitions (json or yaml)"
  		},
  		{
  			type: "array",
  			description: "Workflow Error definitions. Defines checked errors that can be explicitly handled during workflow execution",
  			items: {
  				type: "object",
  				$ref: "#/definitions/errordef"
  			},
  			additionalItems: false,
  			minItems: 1
  		}
  	]
  };
  var required$5 = [
  	"errors"
  ];
  var definitions$5 = {
  	errordef: {
  		type: "object",
  		properties: {
  			name: {
  				type: "string",
  				description: "Domain-specific error name",
  				minLength: 1
  			},
  			code: {
  				type: "string",
  				description: "Error code. Can be used in addition to the name to help runtimes resolve to technical errors/exceptions. Should not be defined if error is set to '*'",
  				minLength: 1
  			},
  			description: {
  				type: "string",
  				description: "Error description"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"name"
  		]
  	}
  };
  var errorsSchema = {
  	$id: $id$6,
  	$schema: $schema$6,
  	description: description$6,
  	type: type$7,
  	errors: errors,
  	required: required$5,
  	definitions: definitions$5
  };

  var $id$5 = "https://serverlessworkflow.io/schemas/0.7/events.json";
  var $schema$5 = "http://json-schema.org/draft-07/schema#";
  var description$5 = "Serverless Workflow specification - events schema";
  var type$6 = "object";
  var events = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing event definitions (json or yaml)"
  		},
  		{
  			type: "array",
  			description: "Workflow CloudEvent definitions. Defines CloudEvents that can be consumed or produced",
  			items: {
  				type: "object",
  				$ref: "#/definitions/eventdef"
  			},
  			additionalItems: false,
  			minItems: 1
  		}
  	]
  };
  var required$4 = [
  	"events"
  ];
  var definitions$4 = {
  	eventdef: {
  		type: "object",
  		properties: {
  			name: {
  				type: "string",
  				description: "Unique event name",
  				minLength: 1
  			},
  			source: {
  				type: "string",
  				description: "CloudEvent source"
  			},
  			type: {
  				type: "string",
  				description: "CloudEvent type"
  			},
  			kind: {
  				type: "string",
  				"enum": [
  					"consumed",
  					"produced"
  				],
  				description: "Defines the CloudEvent as either 'consumed' or 'produced' by the workflow. Default is 'consumed'",
  				"default": "consumed"
  			},
  			correlation: {
  				type: "array",
  				description: "CloudEvent correlation definitions",
  				minItems: 1,
  				items: {
  					type: "object",
  					$ref: "#/definitions/correlationDef"
  				},
  				additionalItems: false
  			},
  			dataOnly: {
  				type: "boolean",
  				"default": true,
  				description: "If `true`, only the Event payload is accessible to consuming Workflow states. If `false`, both event payload and context attributes should be accessible "
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata",
  				description: "Metadata information"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				kind: {
  					"const": "consumed"
  				}
  			}
  		},
  		then: {
  			required: [
  				"name",
  				"source",
  				"type"
  			]
  		},
  		"else": {
  			required: [
  				"name",
  				"type"
  			]
  		}
  	},
  	correlationDef: {
  		type: "object",
  		description: "CloudEvent correlation definition",
  		properties: {
  			contextAttributeName: {
  				type: "string",
  				description: "CloudEvent Extension Context Attribute name",
  				minLength: 1
  			},
  			contextAttributeValue: {
  				type: "string",
  				description: "CloudEvent Extension Context Attribute value",
  				minLength: 1
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"contextAttributeName"
  		]
  	}
  };
  var eventsSchema = {
  	$id: $id$5,
  	$schema: $schema$5,
  	description: description$5,
  	type: type$6,
  	events: events,
  	required: required$4,
  	definitions: definitions$4
  };

  var $id$4 = "https://serverlessworkflow.io/schemas/0.7/functions.json";
  var $schema$4 = "http://json-schema.org/draft-07/schema#";
  var description$4 = "Serverless Workflow specification - functions schema";
  var type$5 = "object";
  var functions = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing function definitions (json or yaml)"
  		},
  		{
  			type: "array",
  			description: "Workflow function definitions",
  			items: {
  				type: "object",
  				$ref: "#/definitions/function"
  			},
  			additionalItems: false,
  			minItems: 1
  		}
  	]
  };
  var required$3 = [
  	"functions"
  ];
  var definitions$3 = {
  	"function": {
  		type: "object",
  		properties: {
  			name: {
  				type: "string",
  				description: "Unique function name",
  				minLength: 1
  			},
  			operation: {
  				type: "string",
  				description: "If type is `rest`, <path_to_openapi_definition>#<operation_id>. If type is `asyncapi`, <path_to_asyncapi_definition>#<operation_id>. If type is `rpc`, <path_to_grpc_proto_file>#<service_name>#<service_method>. If type is `graphql`, <url_to_graphql_endpoint>#<literal \\\"mutation\\\" or \\\"query\\\">#<query_or_mutation_name>. If type is `odata`, <URI_to_odata_service>#<Entity_Set_Name>. If type is `expression`, defines the workflow expression.",
  				minLength: 1
  			},
  			type: {
  				type: "string",
  				description: "Defines the function type. Is either `rest`, `asyncapi, `rpc`, `graphql`, `odata`, or `expression`. Default is `rest`",
  				"enum": [
  					"rest",
  					"asyncapi",
  					"rpc",
  					"graphql",
  					"odata",
  					"expression"
  				],
  				"default": "rest"
  			},
  			authRef: {
  				type: "string",
  				description: "References an auth definition name to be used to access to resource defined in the operation parameter",
  				minLength: 1
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"name",
  			"operation"
  		]
  	}
  };
  var functionsSchema = {
  	$id: $id$4,
  	$schema: $schema$4,
  	description: description$4,
  	type: type$5,
  	functions: functions,
  	required: required$3,
  	definitions: definitions$3
  };

  var $id$3 = "https://serverlessworkflow.io/schemas/0.7/retries.json";
  var $schema$3 = "http://json-schema.org/draft-07/schema#";
  var description$3 = "Serverless Workflow specification - retries schema";
  var type$4 = "object";
  var retries = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing retry definitions (json or yaml)"
  		},
  		{
  			type: "array",
  			description: "Workflow Retry definitions. Define retry strategies that can be referenced in states onError definitions",
  			items: {
  				type: "object",
  				$ref: "#/definitions/retrydef"
  			},
  			additionalItems: false,
  			minItems: 1
  		}
  	]
  };
  var required$2 = [
  	"retries"
  ];
  var definitions$2 = {
  	retrydef: {
  		type: "object",
  		properties: {
  			name: {
  				type: "string",
  				description: "Unique retry strategy name",
  				minLength: 1
  			},
  			delay: {
  				type: "string",
  				description: "Time delay between retry attempts (ISO 8601 duration format)"
  			},
  			maxDelay: {
  				type: "string",
  				description: "Maximum time delay between retry attempts (ISO 8601 duration format)"
  			},
  			increment: {
  				type: "string",
  				description: "Static value by which the delay increases during each attempt (ISO 8601 time format)"
  			},
  			multiplier: {
  				type: [
  					"number",
  					"string"
  				],
  				minimum: 0,
  				minLength: 1,
  				multipleOf: 0.01,
  				description: "Numeric value, if specified the delay between retries is multiplied by this value."
  			},
  			maxAttempts: {
  				type: [
  					"number",
  					"string"
  				],
  				minimum: 1,
  				minLength: 0,
  				description: "Maximum number of retry attempts."
  			},
  			jitter: {
  				type: [
  					"number",
  					"string"
  				],
  				minimum: 0,
  				maximum: 1,
  				description: "If float type, maximum amount of random time added or subtracted from the delay between each retry relative to total delay (between 0 and 1). If string type, absolute maximum amount of random time added or subtracted from the delay between each retry (ISO 8601 duration format)"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"name",
  			"maxAttempts"
  		]
  	}
  };
  var retriesSchema = {
  	$id: $id$3,
  	$schema: $schema$3,
  	description: description$3,
  	type: type$4,
  	retries: retries,
  	required: required$2,
  	definitions: definitions$2
  };

  var $id$2 = "https://serverlessworkflow.io/schemas/0.7/secrets.json";
  var $schema$2 = "http://json-schema.org/draft-07/schema#";
  var description$2 = "Serverless Workflow specification - secrets schema";
  var type$3 = "object";
  var secrets = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing secrets definitions (json or yaml)"
  		},
  		{
  			type: "array",
  			description: "Workflow Secrets definitions",
  			items: {
  				type: "string"
  			},
  			minItems: 1
  		}
  	]
  };
  var required$1 = [
  	"secrets"
  ];
  var secretsSchema = {
  	$id: $id$2,
  	$schema: $schema$2,
  	description: description$2,
  	type: type$3,
  	secrets: secrets,
  	required: required$1
  };

  var $id$1 = "https://serverlessworkflow.io/schemas/0.7/timeouts.json";
  var $schema$1 = "http://json-schema.org/draft-07/schema#";
  var description$1 = "Serverless Workflow specification - functions schema";
  var type$2 = "object";
  var timeouts = {
  	oneOf: [
  		{
  			type: "string",
  			format: "uri",
  			description: "URI to a resource containing timeouts definitions (json or yaml)"
  		},
  		{
  			type: "object",
  			description: "Workflow default timeouts",
  			properties: {
  				workflowExecTimeout: {
  					$ref: "#/definitions/workflowExecTimeout"
  				},
  				stateExecTimeout: {
  					$ref: "#/definitions/stateExecTimeout"
  				},
  				actionExecTimeout: {
  					$ref: "#/definitions/actionExecTimeout"
  				},
  				branchExecTimeout: {
  					$ref: "#/definitions/branchExecTimeout"
  				},
  				eventTimeout: {
  					$ref: "#/definitions/eventTimeout"
  				}
  			},
  			additionalProperties: false,
  			required: [
  			]
  		}
  	]
  };
  var required = [
  	"timeouts"
  ];
  var definitions$1 = {
  	workflowExecTimeout: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Workflow execution timeout duration (ISO 8601 duration format). If not specified should be 'unlimited'",
  				minLength: 1
  			},
  			{
  				type: "object",
  				properties: {
  					duration: {
  						type: "string",
  						description: "Workflow execution timeout duration (ISO 8601 duration format). If not specified should be 'unlimited'",
  						minLength: 1
  					},
  					interrupt: {
  						type: "boolean",
  						description: "If `false`, workflow instance is allowed to finish current execution. If `true`, current workflow execution is abrupted.",
  						"default": true
  					},
  					runBefore: {
  						type: "string",
  						description: "Name of a workflow state to be executed before workflow instance is terminated",
  						minLength: 1
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"duration"
  				]
  			}
  		]
  	},
  	stateExecTimeout: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Total state execution timeout (including retries) (ISO 8601 duration format)",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Workflow default timeouts",
  				properties: {
  					single: {
  						type: "string",
  						description: "Single state execution timeout, not including retries (ISO 8601 duration format)",
  						minLength: 1
  					},
  					total: {
  						type: "string",
  						description: "Total state execution timeout, including retries (ISO 8601 duration format)",
  						minLength: 1
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"total"
  				]
  			}
  		]
  	},
  	actionExecTimeout: {
  		type: "string",
  		description: "Single actions definition execution timeout duration (ISO 8601 duration format)",
  		minLength: 1
  	},
  	branchExecTimeout: {
  		type: "string",
  		description: "Single branch execution timeout duration (ISO 8601 duration format)",
  		minLength: 1
  	},
  	eventTimeout: {
  		type: "string",
  		description: "Timeout duration to wait for consuming defined events (ISO 8601 duration format)",
  		minLength: 1
  	}
  };
  var timeoutsSchema = {
  	$id: $id$1,
  	$schema: $schema$1,
  	description: description$1,
  	type: type$2,
  	timeouts: timeouts,
  	required: required,
  	definitions: definitions$1
  };

  var $id = "https://serverlessworkflow.io/schemas/0.7/workflow.json";
  var $schema = "http://json-schema.org/draft-07/schema#";
  var description = "Serverless Workflow specification - workflow schema";
  var type$1 = "object";
  var properties = {
  	id: {
  		type: "string",
  		description: "Workflow unique identifier",
  		minLength: 1
  	},
  	key: {
  		type: "string",
  		description: "Domain-specific workflow identifier",
  		minLength: 1
  	},
  	name: {
  		type: "string",
  		description: "Workflow name",
  		minLength: 1
  	},
  	description: {
  		type: "string",
  		description: "Workflow description"
  	},
  	version: {
  		type: "string",
  		description: "Workflow version",
  		minLength: 1
  	},
  	annotations: {
  		type: "array",
  		description: "List of helpful terms describing the workflows intended purpose, subject areas, or other important qualities",
  		minItems: 1,
  		items: {
  			type: "string"
  		},
  		additionalItems: false
  	},
  	dataInputSchema: {
  		oneOf: [
  			{
  				type: "string",
  				description: "URI of the JSON Schema used to validate the workflow data input",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Workflow data input schema definition",
  				properties: {
  					schema: {
  						type: "string",
  						description: "URI of the JSON Schema used to validate the workflow data input",
  						minLength: 1
  					},
  					failOnValidationErrors: {
  						type: "boolean",
  						"default": true,
  						description: "Determines if workflow execution should continue if there are validation errors"
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"schema",
  					"failOnValidationErrors"
  				]
  			}
  		]
  	},
  	secrets: {
  		$ref: "secrets.json#/secrets"
  	},
  	constants: {
  		oneOf: [
  			{
  				type: "string",
  				format: "uri",
  				description: "URI to a resource containing constants data (json or yaml)"
  			},
  			{
  				type: "object",
  				description: "Workflow constants data (object type)"
  			}
  		]
  	},
  	start: {
  		$ref: "#/definitions/startdef"
  	},
  	specVersion: {
  		type: "string",
  		description: "Serverless Workflow schema version",
  		minLength: 1
  	},
  	expressionLang: {
  		type: "string",
  		description: "Identifies the expression language used for workflow expressions. Default is 'jq'",
  		"default": "jq",
  		minLength: 1
  	},
  	timeouts: {
  		$ref: "timeouts.json#/timeouts"
  	},
  	errors: {
  		$ref: "errors.json#/errors"
  	},
  	keepActive: {
  		type: "boolean",
  		"default": false,
  		description: "If 'true', workflow instances is not terminated when there are no active execution paths. Instance can be terminated via 'terminate end definition' or reaching defined 'workflowExecTimeout'"
  	},
  	metadata: {
  		$ref: "common.json#/definitions/metadata"
  	},
  	events: {
  		$ref: "events.json#/events"
  	},
  	functions: {
  		$ref: "functions.json#/functions"
  	},
  	autoRetries: {
  		type: "boolean",
  		"default": false,
  		description: "If set to true, actions should automatically be retried on unchecked errors. Default is false"
  	},
  	retries: {
  		$ref: "retries.json#/retries"
  	},
  	auth: {
  		$ref: "auth.json#/auth"
  	},
  	states: {
  		type: "array",
  		description: "State definitions",
  		items: {
  			anyOf: [
  				{
  					title: "Sleep State",
  					$ref: "#/definitions/sleepstate"
  				},
  				{
  					title: "Event State",
  					$ref: "#/definitions/eventstate"
  				},
  				{
  					title: "Operation State",
  					$ref: "#/definitions/operationstate"
  				},
  				{
  					title: "Parallel State",
  					$ref: "#/definitions/parallelstate"
  				},
  				{
  					title: "Switch State",
  					$ref: "#/definitions/switchstate"
  				},
  				{
  					title: "Inject State",
  					$ref: "#/definitions/injectstate"
  				},
  				{
  					title: "ForEach State",
  					$ref: "#/definitions/foreachstate"
  				},
  				{
  					title: "Callback State",
  					$ref: "#/definitions/callbackstate"
  				}
  			]
  		},
  		additionalItems: false,
  		minItems: 1
  	}
  };
  var oneOf = [
  	{
  		required: [
  			"id",
  			"specVersion",
  			"name",
  			"start",
  			"states"
  		]
  	},
  	{
  		required: [
  			"key",
  			"specVersion",
  			"name",
  			"start",
  			"states"
  		]
  	}
  ];
  var definitions = {
  	sleep: {
  		type: "object",
  		properties: {
  			before: {
  				type: "string",
  				description: "Amount of time (ISO 8601 duration format) to sleep before function/subflow invocation. Does not apply if 'eventRef' is defined."
  			},
  			after: {
  				type: "string",
  				description: "Amount of time (ISO 8601 duration format) to sleep after function/subflow invocation. Does not apply if 'eventRef' is defined."
  			}
  		},
  		oneOf: [
  			{
  				required: [
  					"before"
  				]
  			},
  			{
  				required: [
  					"after"
  				]
  			},
  			{
  				required: [
  					"before",
  					"after"
  				]
  			}
  		]
  	},
  	crondef: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Cron expression defining when workflow instances should be created (automatically)",
  				minLength: 1
  			},
  			{
  				type: "object",
  				properties: {
  					expression: {
  						type: "string",
  						description: "Repeating interval (cron expression) describing when the workflow instance should be created",
  						minLength: 1
  					},
  					validUntil: {
  						type: "string",
  						description: "Specific date and time (ISO 8601 format) when the cron expression invocation is no longer valid"
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"expression"
  				]
  			}
  		]
  	},
  	continueasdef: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Unique id of the workflow to be continue execution as. Entire state data is passed as data input to next execution",
  				minLength: 1
  			},
  			{
  				type: "object",
  				properties: {
  					workflowId: {
  						type: "string",
  						description: "Unique id of the workflow to continue execution as"
  					},
  					version: {
  						type: "string",
  						description: "Version of the workflow to continue execution as",
  						minLength: 1
  					},
  					data: {
  						type: [
  							"string",
  							"object"
  						],
  						description: "If string type, an expression which selects parts of the states data output to become the workflow data input of continued execution. If object type, a custom object to become the workflow data input of the continued execution"
  					},
  					workflowExecTimeout: {
  						$ref: "timeouts.json#/definitions/workflowExecTimeout",
  						description: "Workflow execution timeout to be used by the workflow continuing execution. Overwrites any specific settings set by that workflow"
  					}
  				},
  				required: [
  					"workflowId"
  				]
  			}
  		]
  	},
  	transition: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Name of state to transition to",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Function Reference",
  				properties: {
  					nextState: {
  						type: "string",
  						description: "Name of state to transition to",
  						minLength: 1
  					},
  					produceEvents: {
  						type: "array",
  						description: "Array of events to be produced before the transition happens",
  						items: {
  							type: "object",
  							$ref: "#/definitions/produceeventdef"
  						},
  						additionalItems: false
  					},
  					compensate: {
  						type: "boolean",
  						"default": false,
  						description: "If set to true, triggers workflow compensation when before this transition is taken. Default is false"
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"nextState"
  				]
  			}
  		]
  	},
  	error: {
  		type: "object",
  		properties: {
  			errorRef: {
  				type: "string",
  				description: "Reference to a unique workflow error definition. Used of errorRefs is not used",
  				minLength: 1
  			},
  			errorRefs: {
  				type: "array",
  				description: "References one or more workflow error definitions. Used if errorRef is not used",
  				minItems: 1,
  				items: {
  					type: "string"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Transition to next state to handle the error.",
  				$ref: "#/definitions/transition"
  			},
  			end: {
  				description: "End workflow execution in case of this error.",
  				$ref: "#/definitions/end"
  			}
  		},
  		additionalProperties: false,
  		oneOf: [
  			{
  				required: [
  					"errorRef",
  					"transition"
  				]
  			},
  			{
  				required: [
  					"errorRef",
  					"end"
  				]
  			},
  			{
  				required: [
  					"errorRefs",
  					"transition"
  				]
  			},
  			{
  				required: [
  					"errorRefs",
  					"end"
  				]
  			}
  		]
  	},
  	onevents: {
  		type: "object",
  		properties: {
  			eventRefs: {
  				type: "array",
  				description: "References one or more unique event names in the defined workflow events",
  				minItems: 1,
  				items: {
  					type: "string"
  				},
  				additionalItems: false
  			},
  			actionMode: {
  				type: "string",
  				"enum": [
  					"sequential",
  					"parallel"
  				],
  				description: "Specifies how actions are to be performed (in sequence or in parallel)",
  				"default": "sequential"
  			},
  			actions: {
  				type: "array",
  				description: "Actions to be performed if expression matches",
  				items: {
  					type: "object",
  					$ref: "#/definitions/action"
  				},
  				additionalItems: false
  			},
  			eventDataFilter: {
  				description: "Event data filter",
  				$ref: "#/definitions/eventdatafilter"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"eventRefs"
  		]
  	},
  	action: {
  		type: "object",
  		properties: {
  			name: {
  				type: "string",
  				description: "Unique action definition name"
  			},
  			functionRef: {
  				description: "References a function to be invoked",
  				$ref: "#/definitions/functionref"
  			},
  			eventRef: {
  				description: "References a 'trigger' and 'result' reusable event definitions",
  				$ref: "#/definitions/eventref"
  			},
  			subFlowRef: {
  				description: "References a sub-workflow to invoke",
  				$ref: "#/definitions/subflowref"
  			},
  			sleep: {
  				description: "Defines time periods workflow execution should sleep before / after function execution",
  				$ref: "#/definitions/sleep"
  			},
  			retryRef: {
  				type: "string",
  				description: "References a defined workflow retry definition. If not defined the default retry policy is assumed"
  			},
  			nonRetryableErrors: {
  				type: "array",
  				description: "List of unique references to defined workflow errors for which the action should not be retried. Used only when `autoRetries` is set to `true`",
  				minItems: 1,
  				items: {
  					type: "string"
  				},
  				additionalItems: false
  			},
  			retryableErrors: {
  				type: "array",
  				description: "List of unique references to defined workflow errors for which the action should be retried. Used only when `autoRetries` is set to `false`",
  				minItems: 1,
  				items: {
  					type: "string"
  				},
  				additionalItems: false
  			},
  			actionDataFilter: {
  				description: "Action data filter",
  				$ref: "#/definitions/actiondatafilter"
  			}
  		},
  		additionalProperties: false,
  		oneOf: [
  			{
  				required: [
  					"functionRef"
  				]
  			},
  			{
  				required: [
  					"eventRef"
  				]
  			},
  			{
  				required: [
  					"subFlowRef"
  				]
  			}
  		]
  	},
  	functionref: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Name of the referenced function",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Function Reference",
  				properties: {
  					refName: {
  						type: "string",
  						description: "Name of the referenced function"
  					},
  					"arguments": {
  						type: "object",
  						description: "Function arguments/inputs"
  					},
  					selectionSet: {
  						type: "string",
  						description: "Only used if function type is 'graphql'. A string containing a valid GraphQL selection set"
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"refName"
  				]
  			}
  		]
  	},
  	eventref: {
  		type: "object",
  		description: "Event References",
  		properties: {
  			triggerEventRef: {
  				type: "string",
  				description: "Reference to the unique name of a 'produced' event definition"
  			},
  			resultEventRef: {
  				type: "string",
  				description: "Reference to the unique name of a 'consumed' event definition"
  			},
  			data: {
  				type: [
  					"string",
  					"object"
  				],
  				description: "If string type, an expression which selects parts of the states data output to become the data (payload) of the event referenced by 'triggerEventRef'. If object type, a custom object to become the data (payload) of the event referenced by 'triggerEventRef'."
  			},
  			contextAttributes: {
  				type: "object",
  				description: "Add additional extension context attributes to the produced event",
  				additionalProperties: {
  					type: "string"
  				}
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"triggerEventRef",
  			"resultEventRef"
  		]
  	},
  	subflowref: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Unique id of the sub-workflow to be invoked",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Specifies a sub-workflow to be invoked",
  				properties: {
  					workflowId: {
  						type: "string",
  						description: "Unique id of the sub-workflow to be invoked"
  					},
  					version: {
  						type: "string",
  						description: "Version of the sub-workflow to be invoked",
  						minLength: 1
  					}
  				},
  				required: [
  					"workflowId"
  				]
  			}
  		]
  	},
  	branch: {
  		type: "object",
  		description: "Branch Definition",
  		properties: {
  			name: {
  				type: "string",
  				description: "Branch name"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					actionExecTimeout: {
  						$ref: "timeouts.json#/definitions/actionExecTimeout"
  					},
  					branchExecTimeout: {
  						$ref: "timeouts.json#/definitions/branchExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			actions: {
  				type: "array",
  				description: "Actions to be executed in this branch",
  				items: {
  					type: "object",
  					$ref: "#/definitions/action"
  				},
  				additionalItems: false
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"name",
  			"actions"
  		]
  	},
  	sleepstate: {
  		type: "object",
  		description: "Causes the workflow execution to sleep for a specified duration",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "sleep",
  				description: "State type"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			duration: {
  				type: "string",
  				description: "Duration (ISO 8601 duration format) to sleep"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Next transition of the workflow after the workflow sleep",
  				$ref: "#/definitions/transition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				usedForCompensation: {
  					"const": true
  				}
  			},
  			required: [
  				"usedForCompensation"
  			]
  		},
  		then: {
  			required: [
  				"name",
  				"type",
  				"duration"
  			]
  		},
  		"else": {
  			oneOf: [
  				{
  					required: [
  						"name",
  						"type",
  						"duration",
  						"end"
  					]
  				},
  				{
  					required: [
  						"name",
  						"type",
  						"duration",
  						"transition"
  					]
  				}
  			]
  		}
  	},
  	eventstate: {
  		type: "object",
  		description: "This state is used to wait for events from event sources, then consumes them and invoke one or more actions to run in sequence or parallel",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "event",
  				description: "State type"
  			},
  			exclusive: {
  				type: "boolean",
  				"default": true,
  				description: "If true consuming one of the defined events causes its associated actions to be performed. If false all of the defined events must be consumed in order for actions to be performed"
  			},
  			onEvents: {
  				type: "array",
  				description: "Define the events to be consumed and optional actions to be performed",
  				items: {
  					type: "object",
  					$ref: "#/definitions/onevents"
  				},
  				additionalItems: false
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					},
  					actionExecTimeout: {
  						$ref: "timeouts.json#/definitions/actionExecTimeout"
  					},
  					eventTimeout: {
  						$ref: "timeouts.json#/definitions/eventTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Next transition of the workflow after all the actions have been performed",
  				$ref: "#/definitions/transition"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		oneOf: [
  			{
  				required: [
  					"name",
  					"type",
  					"onEvents",
  					"end"
  				]
  			},
  			{
  				required: [
  					"name",
  					"type",
  					"onEvents",
  					"transition"
  				]
  			}
  		]
  	},
  	operationstate: {
  		type: "object",
  		description: "Defines actions be performed. Does not wait for incoming events",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "operation",
  				description: "State type"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			actionMode: {
  				type: "string",
  				"enum": [
  					"sequential",
  					"parallel"
  				],
  				description: "Specifies whether actions are performed in sequence or in parallel",
  				"default": "sequential"
  			},
  			actions: {
  				type: "array",
  				description: "Actions to be performed",
  				items: {
  					type: "object",
  					$ref: "#/definitions/action"
  				}
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					},
  					actionExecTimeout: {
  						$ref: "timeouts.json#/definitions/actionExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Next transition of the workflow after all the actions have been performed",
  				$ref: "#/definitions/transition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				usedForCompensation: {
  					"const": true
  				}
  			},
  			required: [
  				"usedForCompensation"
  			]
  		},
  		then: {
  			required: [
  				"name",
  				"type",
  				"actions"
  			]
  		},
  		"else": {
  			oneOf: [
  				{
  					required: [
  						"name",
  						"type",
  						"actions",
  						"end"
  					]
  				},
  				{
  					required: [
  						"name",
  						"type",
  						"actions",
  						"transition"
  					]
  				}
  			]
  		}
  	},
  	parallelstate: {
  		type: "object",
  		description: "Consists of a number of states that are executed in parallel",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "parallel",
  				description: "State type"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					},
  					branchExecTimeout: {
  						$ref: "timeouts.json#/definitions/branchExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			branches: {
  				type: "array",
  				description: "Branch Definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/branch"
  				},
  				additionalItems: false
  			},
  			completionType: {
  				type: "string",
  				"enum": [
  					"allOf",
  					"atLeast"
  				],
  				description: "Option types on how to complete branch execution.",
  				"default": "allOf"
  			},
  			numCompleted: {
  				type: [
  					"number",
  					"string"
  				],
  				minimum: 0,
  				minLength: 0,
  				description: "Used when completionType is set to 'atLeast' to specify the minimum number of branches that must complete before the state will transition."
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Next transition of the workflow after all branches have completed execution",
  				$ref: "#/definitions/transition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				usedForCompensation: {
  					"const": true
  				}
  			},
  			required: [
  				"usedForCompensation"
  			]
  		},
  		then: {
  			required: [
  				"name",
  				"type",
  				"branches"
  			]
  		},
  		"else": {
  			oneOf: [
  				{
  					required: [
  						"name",
  						"type",
  						"branches",
  						"end"
  					]
  				},
  				{
  					required: [
  						"name",
  						"type",
  						"branches",
  						"transition"
  					]
  				}
  			]
  		}
  	},
  	switchstate: {
  		oneOf: [
  			{
  				$ref: "#/definitions/databasedswitch"
  			},
  			{
  				$ref: "#/definitions/eventbasedswitch"
  			}
  		]
  	},
  	eventbasedswitch: {
  		type: "object",
  		description: "Permits transitions to other states based on events",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "switch",
  				description: "State type"
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					},
  					eventTimeout: {
  						$ref: "timeouts.json#/definitions/eventTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			eventConditions: {
  				type: "array",
  				description: "Defines conditions evaluated against events",
  				items: {
  					type: "object",
  					$ref: "#/definitions/eventcondition"
  				},
  				additionalItems: false
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			defaultCondition: {
  				description: "Default transition of the workflow if there is no matching data conditions. Can include a transition or end definition",
  				$ref: "#/definitions/defaultconditiondef"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"name",
  			"type",
  			"eventConditions"
  		]
  	},
  	databasedswitch: {
  		type: "object",
  		description: "Permits transitions to other states based on data conditions",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "switch",
  				description: "State type"
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			dataConditions: {
  				type: "array",
  				description: "Defines conditions evaluated against state data",
  				items: {
  					type: "object",
  					$ref: "#/definitions/datacondition"
  				},
  				additionalItems: false
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			defaultCondition: {
  				description: "Default transition of the workflow if there is no matching data conditions. Can include a transition or end definition",
  				$ref: "#/definitions/defaultconditiondef"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"name",
  			"type",
  			"dataConditions"
  		]
  	},
  	defaultconditiondef: {
  		type: "object",
  		description: "DefaultCondition definition. Can be either a transition or end definition",
  		properties: {
  			transition: {
  				$ref: "#/definitions/transition"
  			},
  			end: {
  				$ref: "#/definitions/end"
  			}
  		},
  		additionalProperties: false,
  		oneOf: [
  			{
  				required: [
  					"transition"
  				]
  			},
  			{
  				required: [
  					"end"
  				]
  			}
  		]
  	},
  	eventcondition: {
  		oneOf: [
  			{
  				$ref: "#/definitions/transitioneventcondition"
  			},
  			{
  				$ref: "#/definitions/enddeventcondition"
  			}
  		]
  	},
  	transitioneventcondition: {
  		type: "object",
  		description: "Switch state data event condition",
  		properties: {
  			name: {
  				type: "string",
  				description: "Event condition name"
  			},
  			eventRef: {
  				type: "string",
  				description: "References an unique event name in the defined workflow events"
  			},
  			transition: {
  				description: "Next transition of the workflow if there is valid matches",
  				$ref: "#/definitions/transition"
  			},
  			eventDataFilter: {
  				description: "Event data filter definition",
  				$ref: "#/definitions/eventdatafilter"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"eventRef",
  			"transition"
  		]
  	},
  	enddeventcondition: {
  		type: "object",
  		description: "Switch state data event condition",
  		properties: {
  			name: {
  				type: "string",
  				description: "Event condition name"
  			},
  			eventRef: {
  				type: "string",
  				description: "References an unique event name in the defined workflow events"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "Explicit transition to end"
  			},
  			eventDataFilter: {
  				description: "Event data filter definition",
  				$ref: "#/definitions/eventdatafilter"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"eventRef",
  			"end"
  		]
  	},
  	datacondition: {
  		oneOf: [
  			{
  				$ref: "#/definitions/transitiondatacondition"
  			},
  			{
  				$ref: "#/definitions/enddatacondition"
  			}
  		]
  	},
  	transitiondatacondition: {
  		type: "object",
  		description: "Switch state data based condition",
  		properties: {
  			name: {
  				type: "string",
  				description: "Data condition name"
  			},
  			condition: {
  				type: "string",
  				description: "Workflow expression evaluated against state data. Must evaluate to true or false"
  			},
  			transition: {
  				description: "Workflow transition if condition is evaluated to true",
  				$ref: "#/definitions/transition"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"condition",
  			"transition"
  		]
  	},
  	enddatacondition: {
  		type: "object",
  		description: "Switch state data based condition",
  		properties: {
  			name: {
  				type: "string",
  				description: "Data condition name"
  			},
  			condition: {
  				type: "string",
  				description: "Workflow expression evaluated against state data. Must evaluate to true or false"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "Workflow end definition"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"condition",
  			"end"
  		]
  	},
  	injectstate: {
  		type: "object",
  		description: "Inject static data into state data. Does not perform any actions",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique state id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "inject",
  				description: "State type"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			data: {
  				type: "object",
  				description: "JSON object which can be set as states data input and can be manipulated via filters"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			transition: {
  				description: "Next transition of the workflow after injection has completed",
  				$ref: "#/definitions/transition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				usedForCompensation: {
  					"const": true
  				}
  			},
  			required: [
  				"usedForCompensation"
  			]
  		},
  		then: {
  			required: [
  				"name",
  				"type",
  				"data"
  			]
  		},
  		"else": {
  			oneOf: [
  				{
  					required: [
  						"name",
  						"type",
  						"data",
  						"end"
  					]
  				},
  				{
  					required: [
  						"name",
  						"type",
  						"data",
  						"transition"
  					]
  				}
  			]
  		}
  	},
  	foreachstate: {
  		type: "object",
  		description: "Execute a set of defined actions or workflows for each element of a data array",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique State id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "foreach",
  				description: "State type"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			inputCollection: {
  				type: "string",
  				description: "Workflow expression selecting an array element of the states data"
  			},
  			outputCollection: {
  				type: "string",
  				description: "Workflow expression specifying an array element of the states data to add the results of each iteration"
  			},
  			iterationParam: {
  				type: "string",
  				description: "Name of the iteration parameter that can be referenced in actions/workflow. For each parallel iteration, this param should contain an unique element of the inputCollection array"
  			},
  			batchSize: {
  				type: [
  					"number",
  					"string"
  				],
  				minimum: 0,
  				minLength: 0,
  				description: "Specifies how many iterations may run in parallel at the same time. Used if 'mode' property is set to 'parallel' (default)"
  			},
  			actions: {
  				type: "array",
  				description: "Actions to be executed for each of the elements of inputCollection",
  				items: {
  					type: "object",
  					$ref: "#/definitions/action"
  				},
  				additionalItems: false
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					},
  					actionExecTimeout: {
  						$ref: "timeouts.json#/definitions/actionExecTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Next transition of the workflow after state has completed",
  				$ref: "#/definitions/transition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			mode: {
  				type: "string",
  				"enum": [
  					"sequential",
  					"parallel"
  				],
  				description: "Specifies how iterations are to be performed (sequentially or in parallel)",
  				"default": "parallel"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				usedForCompensation: {
  					"const": true
  				}
  			},
  			required: [
  				"usedForCompensation"
  			]
  		},
  		then: {
  			required: [
  				"name",
  				"type",
  				"inputCollection",
  				"iterationParam",
  				"actions"
  			]
  		},
  		"else": {
  			oneOf: [
  				{
  					required: [
  						"name",
  						"type",
  						"inputCollection",
  						"iterationParam",
  						"actions",
  						"end"
  					]
  				},
  				{
  					required: [
  						"name",
  						"type",
  						"inputCollection",
  						"iterationParam",
  						"actions",
  						"transition"
  					]
  				}
  			]
  		}
  	},
  	callbackstate: {
  		type: "object",
  		description: "This state performs an action, then waits for the callback event that denotes completion of the action",
  		properties: {
  			id: {
  				type: "string",
  				description: "Unique state id",
  				minLength: 1
  			},
  			name: {
  				type: "string",
  				description: "State name"
  			},
  			type: {
  				type: "string",
  				"const": "callback",
  				description: "State type"
  			},
  			action: {
  				description: "Defines the action to be executed",
  				$ref: "#/definitions/action"
  			},
  			eventRef: {
  				type: "string",
  				description: "References an unique callback event name in the defined workflow events"
  			},
  			timeouts: {
  				type: "object",
  				description: "State specific timeouts",
  				properties: {
  					stateExecTimeout: {
  						$ref: "timeouts.json#/definitions/stateExecTimeout"
  					},
  					actionExecTimeout: {
  						$ref: "timeouts.json#/definitions/actionExecTimeout"
  					},
  					eventTimeout: {
  						$ref: "timeouts.json#/definitions/eventTimeout"
  					}
  				},
  				required: [
  				]
  			},
  			eventDataFilter: {
  				description: "Event data filter",
  				$ref: "#/definitions/eventdatafilter"
  			},
  			stateDataFilter: {
  				description: "State data filter",
  				$ref: "#/definitions/statedatafilter"
  			},
  			onErrors: {
  				type: "array",
  				description: "States error handling definitions",
  				items: {
  					type: "object",
  					$ref: "#/definitions/error"
  				},
  				additionalItems: false
  			},
  			transition: {
  				description: "Next transition of the workflow after all the actions have been performed",
  				$ref: "#/definitions/transition"
  			},
  			end: {
  				$ref: "#/definitions/end",
  				description: "State end definition"
  			},
  			compensatedBy: {
  				type: "string",
  				minLength: 1,
  				description: "Unique Name of a workflow state which is responsible for compensation of this state"
  			},
  			usedForCompensation: {
  				type: "boolean",
  				"default": false,
  				description: "If true, this state is used to compensate another state. Default is false"
  			},
  			metadata: {
  				$ref: "common.json#/definitions/metadata"
  			}
  		},
  		additionalProperties: false,
  		"if": {
  			properties: {
  				usedForCompensation: {
  					"const": true
  				}
  			},
  			required: [
  				"usedForCompensation"
  			]
  		},
  		then: {
  			required: [
  				"name",
  				"type",
  				"action",
  				"eventRef"
  			]
  		},
  		"else": {
  			oneOf: [
  				{
  					required: [
  						"name",
  						"type",
  						"action",
  						"eventRef",
  						"end"
  					]
  				},
  				{
  					required: [
  						"name",
  						"type",
  						"action",
  						"eventRef",
  						"transition"
  					]
  				}
  			]
  		}
  	},
  	startdef: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Name of the starting workflow state",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Workflow start definition",
  				properties: {
  					stateName: {
  						type: "string",
  						description: "Name of the starting workflow state",
  						minLength: 1
  					},
  					schedule: {
  						description: "Define the time/repeating intervals or cron at which workflow instances should be automatically started.",
  						$ref: "#/definitions/schedule"
  					}
  				},
  				additionalProperties: false,
  				required: [
  					"stateName",
  					"schedule"
  				]
  			}
  		]
  	},
  	schedule: {
  		oneOf: [
  			{
  				type: "string",
  				description: "Time interval (must be repeating interval) described with ISO 8601 format. Declares when workflow instances will be automatically created.  (UTC timezone is assumed)",
  				minLength: 1
  			},
  			{
  				type: "object",
  				description: "Start state schedule definition",
  				properties: {
  					interval: {
  						type: "string",
  						description: "Time interval (must be repeating interval) described with ISO 8601 format. Declares when workflow instances will be automatically created.",
  						minLength: 1
  					},
  					cron: {
  						$ref: "#/definitions/crondef"
  					},
  					timezone: {
  						type: "string",
  						description: "Timezone name used to evaluate the interval & cron-expression. (default: UTC)"
  					}
  				},
  				additionalProperties: false,
  				oneOf: [
  					{
  						required: [
  							"interval"
  						]
  					},
  					{
  						required: [
  							"cron"
  						]
  					}
  				]
  			}
  		]
  	},
  	end: {
  		oneOf: [
  			{
  				type: "boolean",
  				description: "State end definition",
  				"default": true
  			},
  			{
  				type: "object",
  				description: "State end definition",
  				properties: {
  					terminate: {
  						type: "boolean",
  						"default": false,
  						description: "If true, completes all execution flows in the given workflow instance"
  					},
  					produceEvents: {
  						type: "array",
  						description: "Defines events that should be produced",
  						items: {
  							type: "object",
  							$ref: "#/definitions/produceeventdef"
  						},
  						additionalItems: false
  					},
  					compensate: {
  						type: "boolean",
  						"default": false,
  						description: "If set to true, triggers workflow compensation. Default is false"
  					},
  					continueAs: {
  						$ref: "#/definitions/continueasdef"
  					}
  				},
  				additionalProperties: false,
  				required: [
  				]
  			}
  		]
  	},
  	produceeventdef: {
  		type: "object",
  		description: "Produce an event and set its data",
  		properties: {
  			eventRef: {
  				type: "string",
  				description: "References a name of a defined event"
  			},
  			data: {
  				type: [
  					"string",
  					"object"
  				],
  				description: "If String, expression which selects parts of the states data output to become the data of the produced event. If object a custom object to become the data of produced event."
  			},
  			contextAttributes: {
  				type: "object",
  				description: "Add additional event extension context attributes",
  				additionalProperties: {
  					type: "string"
  				}
  			}
  		},
  		additionalProperties: false,
  		required: [
  			"eventRef"
  		]
  	},
  	statedatafilter: {
  		type: "object",
  		properties: {
  			input: {
  				type: "string",
  				description: "Workflow expression to filter the state data input"
  			},
  			output: {
  				type: "string",
  				description: "Workflow expression that filters the state data output"
  			}
  		},
  		additionalProperties: false,
  		required: [
  		]
  	},
  	eventdatafilter: {
  		type: "object",
  		properties: {
  			data: {
  				type: "string",
  				description: "Workflow expression that filters the received event/payload (default: '${ . }')"
  			},
  			toStateData: {
  				type: "string",
  				description: " Workflow expression that selects a state data element to which the filtered event should be added/merged into. If not specified, denotes, the top-level state data element."
  			}
  		},
  		additionalProperties: false,
  		required: [
  		]
  	},
  	actiondatafilter: {
  		type: "object",
  		properties: {
  			fromStateData: {
  				type: "string",
  				description: "Workflow expression that selects state data that the state action can use"
  			},
  			results: {
  				type: "string",
  				description: "Workflow expression that filters the actions data results"
  			},
  			toStateData: {
  				type: "string",
  				description: "Workflow expression that selects a state data element to which the action results should be added/merged into. If not specified, denote, the top-level state data element"
  			}
  		},
  		additionalProperties: false,
  		required: [
  		]
  	}
  };
  var workflowSchema = {
  	$id: $id,
  	$schema: $schema,
  	description: description,
  	type: type$1,
  	properties: properties,
  	oneOf: oneOf,
  	definitions: definitions
  };

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * A map of type names and their corresponding schema
   */
  var validatorsPaths = [
      ['Workflow', 'https://serverlessworkflow.io/schemas/0.7/workflow.json'],
      ['Sleep', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/sleep'],
      ['Crondef', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/crondef'],
      ['Continueasdef', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/continueasdef'],
      ['Transition', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/transition'],
      ['Error', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/error'],
      ['Onevents', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/onevents'],
      ['Action', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/action'],
      ['Functionref', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/functionref'],
      ['Eventref', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/eventref'],
      ['Subflowref', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/subflowref'],
      ['Branch', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/branch'],
      ['Sleepstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/sleepstate'],
      ['Eventstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/eventstate'],
      ['Operationstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/operationstate'],
      ['Parallelstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/parallelstate'],
      ['Switchstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/switchstate'],
      ['Eventbasedswitch', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/eventbasedswitch'],
      ['Databasedswitch', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/databasedswitch'],
      ['Defaultconditiondef', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/defaultconditiondef'],
      ['Eventcondition', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/eventcondition'],
      [
          'Transitioneventcondition',
          'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/transitioneventcondition',
      ],
      ['Enddeventcondition', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/enddeventcondition'],
      ['Datacondition', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/datacondition'],
      [
          'Transitiondatacondition',
          'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/transitiondatacondition',
      ],
      ['Enddatacondition', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/enddatacondition'],
      ['Injectstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/injectstate'],
      ['Foreachstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/foreachstate'],
      ['Callbackstate', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/callbackstate'],
      ['Startdef', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/startdef'],
      ['Schedule', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/schedule'],
      ['End', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/end'],
      ['Produceeventdef', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/produceeventdef'],
      ['Statedatafilter', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/statedatafilter'],
      ['Eventdatafilter', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/eventdatafilter'],
      ['Actiondatafilter', 'https://serverlessworkflow.io/schemas/0.7/workflow.json#/definitions/actiondatafilter'],
      ['Metadata', 'https://serverlessworkflow.io/schemas/0.7/common.json#/definitions/metadata'],
      ['WorkflowExecTimeout', 'https://serverlessworkflow.io/schemas/0.7/timeouts.json#/definitions/workflowExecTimeout'],
      ['StateExecTimeout', 'https://serverlessworkflow.io/schemas/0.7/timeouts.json#/definitions/stateExecTimeout'],
      ['ActionExecTimeout', 'https://serverlessworkflow.io/schemas/0.7/timeouts.json#/definitions/actionExecTimeout'],
      ['BranchExecTimeout', 'https://serverlessworkflow.io/schemas/0.7/timeouts.json#/definitions/branchExecTimeout'],
      ['EventTimeout', 'https://serverlessworkflow.io/schemas/0.7/timeouts.json#/definitions/eventTimeout'],
      ['Retrydef', 'https://serverlessworkflow.io/schemas/0.7/retries.json#/definitions/retrydef'],
      ['Function', 'https://serverlessworkflow.io/schemas/0.7/functions.json#/definitions/function'],
      ['Errordef', 'https://serverlessworkflow.io/schemas/0.7/errors.json#/definitions/errordef'],
      ['Eventdef', 'https://serverlessworkflow.io/schemas/0.7/events.json#/definitions/eventdef'],
      ['CorrelationDef', 'https://serverlessworkflow.io/schemas/0.7/events.json#/definitions/correlationDef'],
      ['Authdef', 'https://serverlessworkflow.io/schemas/0.7/auth.json#/definitions/authdef'],
      ['Basicpropsdef', 'https://serverlessworkflow.io/schemas/0.7/auth.json#/definitions/basicpropsdef'],
      ['Bearerpropsdef', 'https://serverlessworkflow.io/schemas/0.7/auth.json#/definitions/bearerpropsdef'],
      ['Oauth2propsdef', 'https://serverlessworkflow.io/schemas/0.7/auth.json#/definitions/oauth2propsdef'],
      ['Secrets', 'https://serverlessworkflow.io/schemas/0.7/secrets.json#/secrets'],
      ['Timeouts', 'https://serverlessworkflow.io/schemas/0.7/timeouts.json#/timeouts'],
      ['Errors', 'https://serverlessworkflow.io/schemas/0.7/errors.json#/errors'],
      ['Events', 'https://serverlessworkflow.io/schemas/0.7/events.json#/events'],
      ['Functions', 'https://serverlessworkflow.io/schemas/0.7/functions.json#/functions'],
      ['Retries', 'https://serverlessworkflow.io/schemas/0.7/retries.json#/retries'],
      ['Auth', 'https://serverlessworkflow.io/schemas/0.7/auth.json#/auth'],
  ];

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var schemas = [
      authSchema,
      commonSchema,
      eventsSchema,
      errorsSchema,
      functionsSchema,
      retriesSchema,
      secretsSchema,
      timeoutsSchema,
      workflowSchema,
  ];
  var strict = false;
  var ajv = new Ajv({ schemas: schemas, strict: strict });
  ajv.addFormat('uri', function (uri) { return true; });
  /**
   * A Map of validation functions, where the key is the name of the schema to validate with
   */
  var validators = new Map(validatorsPaths.map(function (_a) {
      var dataType = _a[0], schemaPath = _a[1];
      var validate = ajv.getSchema(schemaPath);
      if (!validate)
          throw "Unable to find schema '" + schemaPath + "' for type '" + dataType + "'";
      return [dataType, validate];
  }));

  var schemaVersion = "0.7";

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var WorkflowValidator = /** @class */ (function () {
      /**
       * Creates a new WorkflowValidator for the provided workflow
       * @param {Workflow} workflow The workflow to validate
       */
      function WorkflowValidator(workflow) {
          this.workflow = workflow;
          /** The validation errors after running validate(), if any */
          this.errors = [];
          var validateFn = validators.get('Workflow');
          validateFn(this.workflow);
          if (validateFn.errors) {
              this.errors = validateFn.errors.map(function (error) {
                  var message = "invalid: " + error.instancePath + " | " + error.schemaPath + " | " + error.message;
                  return new ValidationError$1(message);
              });
          }
          var specVersion = workflow.specVersion;
          if (schemaVersion !== specVersion) {
              var message = "provided workflow.specVersion value '" + specVersion + "' can not be different from the SDK supported version '" + schemaVersion + "'";
              this.errors.push(new ValidationError$1(message));
          }
          this.isValid = this.errors.length === 0;
      }
      return WorkflowValidator;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * A factory for builders that proxy properties assignations and validate against schema on build
   * @param {Function} buildingFn The function used to validate and produce the object on build()
   * @returns {Builder} A builder proxy
   */
  function builder(buildingFn) {
      var data = {};
      var defaultBuildingFn = function (data) {
          return function () {
              return data;
          };
      };
      var proxy = new Proxy({}, {
          get: function (_, prop) {
              if (prop === 'build') {
                  return (buildingFn || defaultBuildingFn)(data);
              }
              return function (value) {
                  data[prop.toString()] = value;
                  return proxy;
              };
          },
          set: function () {
              return false;
          },
      });
      return proxy;
  }

  /*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
  function isNothing(subject) {
    return (typeof subject === 'undefined') || (subject === null);
  }


  function isObject$1(subject) {
    return (typeof subject === 'object') && (subject !== null);
  }


  function toArray(sequence) {
    if (Array.isArray(sequence)) return sequence;
    else if (isNothing(sequence)) return [];

    return [ sequence ];
  }


  function extend(target, source) {
    var index, length, key, sourceKeys;

    if (source) {
      sourceKeys = Object.keys(source);

      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }

    return target;
  }


  function repeat(string, count) {
    var result = '', cycle;

    for (cycle = 0; cycle < count; cycle += 1) {
      result += string;
    }

    return result;
  }


  function isNegativeZero(number) {
    return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
  }


  var isNothing_1      = isNothing;
  var isObject_1       = isObject$1;
  var toArray_1        = toArray;
  var repeat_1         = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1         = extend;

  var common = {
  	isNothing: isNothing_1,
  	isObject: isObject_1,
  	toArray: toArray_1,
  	repeat: repeat_1,
  	isNegativeZero: isNegativeZero_1,
  	extend: extend_1
  };

  // YAML error class. http://stackoverflow.com/questions/8458984


  function formatError(exception, compact) {
    var where = '', message = exception.reason || '(unknown reason)';

    if (!exception.mark) return message;

    if (exception.mark.name) {
      where += 'in "' + exception.mark.name + '" ';
    }

    where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';

    if (!compact && exception.mark.snippet) {
      where += '\n\n' + exception.mark.snippet;
    }

    return message + ' ' + where;
  }


  function YAMLException$1(reason, mark) {
    // Super constructor
    Error.call(this);

    this.name = 'YAMLException';
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);

    // Include stack trace in error object
    if (Error.captureStackTrace) {
      // Chrome and NodeJS
      Error.captureStackTrace(this, this.constructor);
    } else {
      // FF, IE 10+ and Safari 6+. Fallback for others
      this.stack = (new Error()).stack || '';
    }
  }


  // Inherit from Error
  YAMLException$1.prototype = Object.create(Error.prototype);
  YAMLException$1.prototype.constructor = YAMLException$1;


  YAMLException$1.prototype.toString = function toString(compact) {
    return this.name + ': ' + formatError(this, compact);
  };


  var exception = YAMLException$1;

  // get snippet for a single line, respecting maxLength
  function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
    var head = '';
    var tail = '';
    var maxHalfLength = Math.floor(maxLineLength / 2) - 1;

    if (position - lineStart > maxHalfLength) {
      head = ' ... ';
      lineStart = position - maxHalfLength + head.length;
    }

    if (lineEnd - position > maxHalfLength) {
      tail = ' ...';
      lineEnd = position + maxHalfLength - tail.length;
    }

    return {
      str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
      pos: position - lineStart + head.length // relative position
    };
  }


  function padStart(string, max) {
    return common.repeat(' ', max - string.length) + string;
  }


  function makeSnippet(mark, options) {
    options = Object.create(options || null);

    if (!mark.buffer) return null;

    if (!options.maxLength) options.maxLength = 79;
    if (typeof options.indent      !== 'number') options.indent      = 1;
    if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
    if (typeof options.linesAfter  !== 'number') options.linesAfter  = 2;

    var re = /\r?\n|\r|\0/g;
    var lineStarts = [ 0 ];
    var lineEnds = [];
    var match;
    var foundLineNo = -1;

    while ((match = re.exec(mark.buffer))) {
      lineEnds.push(match.index);
      lineStarts.push(match.index + match[0].length);

      if (mark.position <= match.index && foundLineNo < 0) {
        foundLineNo = lineStarts.length - 2;
      }
    }

    if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;

    var result = '', i, line;
    var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
    var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);

    for (i = 1; i <= options.linesBefore; i++) {
      if (foundLineNo - i < 0) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo - i],
        lineEnds[foundLineNo - i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
        maxLineLength
      );
      result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) +
        ' | ' + line.str + '\n' + result;
    }

    line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
    result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n';
    result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';

    for (i = 1; i <= options.linesAfter; i++) {
      if (foundLineNo + i >= lineEnds.length) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo + i],
        lineEnds[foundLineNo + i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
        maxLineLength
      );
      result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) +
        ' | ' + line.str + '\n';
    }

    return result.replace(/\n$/, '');
  }


  var snippet = makeSnippet;

  var TYPE_CONSTRUCTOR_OPTIONS = [
    'kind',
    'multi',
    'resolve',
    'construct',
    'instanceOf',
    'predicate',
    'represent',
    'representName',
    'defaultStyle',
    'styleAliases'
  ];

  var YAML_NODE_KINDS = [
    'scalar',
    'sequence',
    'mapping'
  ];

  function compileStyleAliases(map) {
    var result = {};

    if (map !== null) {
      Object.keys(map).forEach(function (style) {
        map[style].forEach(function (alias) {
          result[String(alias)] = style;
        });
      });
    }

    return result;
  }

  function Type$1(tag, options) {
    options = options || {};

    Object.keys(options).forEach(function (name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });

    // TODO: Add tag format check.
    this.options       = options; // keep original options in case user wants to extend this type later
    this.tag           = tag;
    this.kind          = options['kind']          || null;
    this.resolve       = options['resolve']       || function () { return true; };
    this.construct     = options['construct']     || function (data) { return data; };
    this.instanceOf    = options['instanceOf']    || null;
    this.predicate     = options['predicate']     || null;
    this.represent     = options['represent']     || null;
    this.representName = options['representName'] || null;
    this.defaultStyle  = options['defaultStyle']  || null;
    this.multi         = options['multi']         || false;
    this.styleAliases  = compileStyleAliases(options['styleAliases'] || null);

    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }

  var type = Type$1;

  /*eslint-disable max-len*/





  function compileList(schema, name) {
    var result = [];

    schema[name].forEach(function (currentType) {
      var newIndex = result.length;

      result.forEach(function (previousType, previousIndex) {
        if (previousType.tag === currentType.tag &&
            previousType.kind === currentType.kind &&
            previousType.multi === currentType.multi) {

          newIndex = previousIndex;
        }
      });

      result[newIndex] = currentType;
    });

    return result;
  }


  function compileMap(/* lists... */) {
    var result = {
          scalar: {},
          sequence: {},
          mapping: {},
          fallback: {},
          multi: {
            scalar: [],
            sequence: [],
            mapping: [],
            fallback: []
          }
        }, index, length;

    function collectType(type) {
      if (type.multi) {
        result.multi[type.kind].push(type);
        result.multi['fallback'].push(type);
      } else {
        result[type.kind][type.tag] = result['fallback'][type.tag] = type;
      }
    }

    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result;
  }


  function Schema$1(definition) {
    return this.extend(definition);
  }


  Schema$1.prototype.extend = function extend(definition) {
    var implicit = [];
    var explicit = [];

    if (definition instanceof type) {
      // Schema.extend(type)
      explicit.push(definition);

    } else if (Array.isArray(definition)) {
      // Schema.extend([ type1, type2, ... ])
      explicit = explicit.concat(definition);

    } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
      // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
      if (definition.implicit) implicit = implicit.concat(definition.implicit);
      if (definition.explicit) explicit = explicit.concat(definition.explicit);

    } else {
      throw new exception('Schema.extend argument should be a Type, [ Type ], ' +
        'or a schema definition ({ implicit: [...], explicit: [...] })');
    }

    implicit.forEach(function (type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
      }

      if (type$1.loadKind && type$1.loadKind !== 'scalar') {
        throw new exception('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
      }

      if (type$1.multi) {
        throw new exception('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
      }
    });

    explicit.forEach(function (type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
      }
    });

    var result = Object.create(Schema$1.prototype);

    result.implicit = (this.implicit || []).concat(implicit);
    result.explicit = (this.explicit || []).concat(explicit);

    result.compiledImplicit = compileList(result, 'implicit');
    result.compiledExplicit = compileList(result, 'explicit');
    result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

    return result;
  };


  var schema = Schema$1;

  var str = new type('tag:yaml.org,2002:str', {
    kind: 'scalar',
    construct: function (data) { return data !== null ? data : ''; }
  });

  var seq = new type('tag:yaml.org,2002:seq', {
    kind: 'sequence',
    construct: function (data) { return data !== null ? data : []; }
  });

  var map = new type('tag:yaml.org,2002:map', {
    kind: 'mapping',
    construct: function (data) { return data !== null ? data : {}; }
  });

  var failsafe = new schema({
    explicit: [
      str,
      seq,
      map
    ]
  });

  function resolveYamlNull(data) {
    if (data === null) return true;

    var max = data.length;

    return (max === 1 && data === '~') ||
           (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
  }

  function constructYamlNull() {
    return null;
  }

  function isNull(object) {
    return object === null;
  }

  var _null = new type('tag:yaml.org,2002:null', {
    kind: 'scalar',
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: function () { return '~';    },
      lowercase: function () { return 'null'; },
      uppercase: function () { return 'NULL'; },
      camelcase: function () { return 'Null'; },
      empty:     function () { return '';     }
    },
    defaultStyle: 'lowercase'
  });

  function resolveYamlBoolean(data) {
    if (data === null) return false;

    var max = data.length;

    return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
           (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
  }

  function constructYamlBoolean(data) {
    return data === 'true' ||
           data === 'True' ||
           data === 'TRUE';
  }

  function isBoolean(object) {
    return Object.prototype.toString.call(object) === '[object Boolean]';
  }

  var bool = new type('tag:yaml.org,2002:bool', {
    kind: 'scalar',
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function (object) { return object ? 'true' : 'false'; },
      uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
      camelcase: function (object) { return object ? 'True' : 'False'; }
    },
    defaultStyle: 'lowercase'
  });

  function isHexCode(c) {
    return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
           ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
           ((0x61/* a */ <= c) && (c <= 0x66/* f */));
  }

  function isOctCode(c) {
    return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
  }

  function isDecCode(c) {
    return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
  }

  function resolveYamlInteger(data) {
    if (data === null) return false;

    var max = data.length,
        index = 0,
        hasDigits = false,
        ch;

    if (!max) return false;

    ch = data[index];

    // sign
    if (ch === '-' || ch === '+') {
      ch = data[++index];
    }

    if (ch === '0') {
      // 0
      if (index + 1 === max) return true;
      ch = data[++index];

      // base 2, base 8, base 16

      if (ch === 'b') {
        // base 2
        index++;

        for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') continue;
          if (ch !== '0' && ch !== '1') return false;
          hasDigits = true;
        }
        return hasDigits && ch !== '_';
      }


      if (ch === 'x') {
        // base 16
        index++;

        for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') continue;
          if (!isHexCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== '_';
      }


      if (ch === 'o') {
        // base 8
        index++;

        for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== '_';
      }
    }

    // base 10 (except 0)

    // value should not start with `_`;
    if (ch === '_') return false;

    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') continue;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }

    // Should have digits and should not end with `_`
    if (!hasDigits || ch === '_') return false;

    return true;
  }

  function constructYamlInteger(data) {
    var value = data, sign = 1, ch;

    if (value.indexOf('_') !== -1) {
      value = value.replace(/_/g, '');
    }

    ch = value[0];

    if (ch === '-' || ch === '+') {
      if (ch === '-') sign = -1;
      value = value.slice(1);
      ch = value[0];
    }

    if (value === '0') return 0;

    if (ch === '0') {
      if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
      if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
      if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
    }

    return sign * parseInt(value, 10);
  }

  function isInteger(object) {
    return (Object.prototype.toString.call(object)) === '[object Number]' &&
           (object % 1 === 0 && !common.isNegativeZero(object));
  }

  var int = new type('tag:yaml.org,2002:int', {
    kind: 'scalar',
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
      octal:       function (obj) { return obj >= 0 ? '0o'  + obj.toString(8) : '-0o'  + obj.toString(8).slice(1); },
      decimal:     function (obj) { return obj.toString(10); },
      /* eslint-disable max-len */
      hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
    },
    defaultStyle: 'decimal',
    styleAliases: {
      binary:      [ 2,  'bin' ],
      octal:       [ 8,  'oct' ],
      decimal:     [ 10, 'dec' ],
      hexadecimal: [ 16, 'hex' ]
    }
  });

  var YAML_FLOAT_PATTERN = new RegExp(
    // 2.5e4, 2.5 and integers
    '^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
    // .2e4, .2
    // special case, seems not from spec
    '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
    // .inf
    '|[-+]?\\.(?:inf|Inf|INF)' +
    // .nan
    '|\\.(?:nan|NaN|NAN))$');

  function resolveYamlFloat(data) {
    if (data === null) return false;

    if (!YAML_FLOAT_PATTERN.test(data) ||
        // Quick hack to not allow integers end with `_`
        // Probably should update regexp & check speed
        data[data.length - 1] === '_') {
      return false;
    }

    return true;
  }

  function constructYamlFloat(data) {
    var value, sign;

    value  = data.replace(/_/g, '').toLowerCase();
    sign   = value[0] === '-' ? -1 : 1;

    if ('+-'.indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }

    if (value === '.inf') {
      return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

    } else if (value === '.nan') {
      return NaN;
    }
    return sign * parseFloat(value, 10);
  }


  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

  function representYamlFloat(object, style) {
    var res;

    if (isNaN(object)) {
      switch (style) {
        case 'lowercase': return '.nan';
        case 'uppercase': return '.NAN';
        case 'camelcase': return '.NaN';
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case 'lowercase': return '.inf';
        case 'uppercase': return '.INF';
        case 'camelcase': return '.Inf';
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case 'lowercase': return '-.inf';
        case 'uppercase': return '-.INF';
        case 'camelcase': return '-.Inf';
      }
    } else if (common.isNegativeZero(object)) {
      return '-0.0';
    }

    res = object.toString(10);

    // JS stringifier can build scientific format without dots: 5e-100,
    // while YAML requres dot: 5.e-100. Fix it with simple hack

    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
  }

  function isFloat(object) {
    return (Object.prototype.toString.call(object) === '[object Number]') &&
           (object % 1 !== 0 || common.isNegativeZero(object));
  }

  var float = new type('tag:yaml.org,2002:float', {
    kind: 'scalar',
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: 'lowercase'
  });

  var json = failsafe.extend({
    implicit: [
      _null,
      bool,
      int,
      float
    ]
  });

  var core = json;

  var YAML_DATE_REGEXP = new RegExp(
    '^([0-9][0-9][0-9][0-9])'          + // [1] year
    '-([0-9][0-9])'                    + // [2] month
    '-([0-9][0-9])$');                   // [3] day

  var YAML_TIMESTAMP_REGEXP = new RegExp(
    '^([0-9][0-9][0-9][0-9])'          + // [1] year
    '-([0-9][0-9]?)'                   + // [2] month
    '-([0-9][0-9]?)'                   + // [3] day
    '(?:[Tt]|[ \\t]+)'                 + // ...
    '([0-9][0-9]?)'                    + // [4] hour
    ':([0-9][0-9])'                    + // [5] minute
    ':([0-9][0-9])'                    + // [6] second
    '(?:\\.([0-9]*))?'                 + // [7] fraction
    '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
    '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

  function resolveYamlTimestamp(data) {
    if (data === null) return false;
    if (YAML_DATE_REGEXP.exec(data) !== null) return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
    return false;
  }

  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0,
        delta = null, tz_hour, tz_minute, date;

    match = YAML_DATE_REGEXP.exec(data);
    if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

    if (match === null) throw new Error('Date resolve error');

    // match: [1] year [2] month [3] day

    year = +(match[1]);
    month = +(match[2]) - 1; // JS month starts with 0
    day = +(match[3]);

    if (!match[4]) { // no hour
      return new Date(Date.UTC(year, month, day));
    }

    // match: [4] hour [5] minute [6] second [7] fraction

    hour = +(match[4]);
    minute = +(match[5]);
    second = +(match[6]);

    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) { // milli-seconds
        fraction += '0';
      }
      fraction = +fraction;
    }

    // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

    if (match[9]) {
      tz_hour = +(match[10]);
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
      if (match[9] === '-') delta = -delta;
    }

    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

    if (delta) date.setTime(date.getTime() - delta);

    return date;
  }

  function representYamlTimestamp(object /*, style*/) {
    return object.toISOString();
  }

  var timestamp = new type('tag:yaml.org,2002:timestamp', {
    kind: 'scalar',
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });

  function resolveYamlMerge(data) {
    return data === '<<' || data === null;
  }

  var merge = new type('tag:yaml.org,2002:merge', {
    kind: 'scalar',
    resolve: resolveYamlMerge
  });

  /*eslint-disable no-bitwise*/





  // [ 64, 65, 66 ] -> [ padding, CR, LF ]
  var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


  function resolveYamlBinary(data) {
    if (data === null) return false;

    var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

    // Convert one by one.
    for (idx = 0; idx < max; idx++) {
      code = map.indexOf(data.charAt(idx));

      // Skip CR/LF
      if (code > 64) continue;

      // Fail on illegal characters
      if (code < 0) return false;

      bitlen += 6;
    }

    // If there are any bits left, source was corrupted
    return (bitlen % 8) === 0;
  }

  function constructYamlBinary(data) {
    var idx, tailbits,
        input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
        max = input.length,
        map = BASE64_MAP,
        bits = 0,
        result = [];

    // Collect by 6*4 bits (3 bytes)

    for (idx = 0; idx < max; idx++) {
      if ((idx % 4 === 0) && idx) {
        result.push((bits >> 16) & 0xFF);
        result.push((bits >> 8) & 0xFF);
        result.push(bits & 0xFF);
      }

      bits = (bits << 6) | map.indexOf(input.charAt(idx));
    }

    // Dump tail

    tailbits = (max % 4) * 6;

    if (tailbits === 0) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    } else if (tailbits === 18) {
      result.push((bits >> 10) & 0xFF);
      result.push((bits >> 2) & 0xFF);
    } else if (tailbits === 12) {
      result.push((bits >> 4) & 0xFF);
    }

    return new Uint8Array(result);
  }

  function representYamlBinary(object /*, style*/) {
    var result = '', bits = 0, idx, tail,
        max = object.length,
        map = BASE64_MAP;

    // Convert every three bytes to 4 ASCII characters.

    for (idx = 0; idx < max; idx++) {
      if ((idx % 3 === 0) && idx) {
        result += map[(bits >> 18) & 0x3F];
        result += map[(bits >> 12) & 0x3F];
        result += map[(bits >> 6) & 0x3F];
        result += map[bits & 0x3F];
      }

      bits = (bits << 8) + object[idx];
    }

    // Dump tail

    tail = max % 3;

    if (tail === 0) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    } else if (tail === 2) {
      result += map[(bits >> 10) & 0x3F];
      result += map[(bits >> 4) & 0x3F];
      result += map[(bits << 2) & 0x3F];
      result += map[64];
    } else if (tail === 1) {
      result += map[(bits >> 2) & 0x3F];
      result += map[(bits << 4) & 0x3F];
      result += map[64];
      result += map[64];
    }

    return result;
  }

  function isBinary(obj) {
    return Object.prototype.toString.call(obj) ===  '[object Uint8Array]';
  }

  var binary = new type('tag:yaml.org,2002:binary', {
    kind: 'scalar',
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });

  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  var _toString$2       = Object.prototype.toString;

  function resolveYamlOmap(data) {
    if (data === null) return true;

    var objectKeys = [], index, length, pair, pairKey, pairHasKey,
        object = data;

    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;

      if (_toString$2.call(pair) !== '[object Object]') return false;

      for (pairKey in pair) {
        if (_hasOwnProperty$3.call(pair, pairKey)) {
          if (!pairHasKey) pairHasKey = true;
          else return false;
        }
      }

      if (!pairHasKey) return false;

      if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
      else return false;
    }

    return true;
  }

  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }

  var omap = new type('tag:yaml.org,2002:omap', {
    kind: 'sequence',
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });

  var _toString$1 = Object.prototype.toString;

  function resolveYamlPairs(data) {
    if (data === null) return true;

    var index, length, pair, keys, result,
        object = data;

    result = new Array(object.length);

    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];

      if (_toString$1.call(pair) !== '[object Object]') return false;

      keys = Object.keys(pair);

      if (keys.length !== 1) return false;

      result[index] = [ keys[0], pair[keys[0]] ];
    }

    return true;
  }

  function constructYamlPairs(data) {
    if (data === null) return [];

    var index, length, pair, keys, result,
        object = data;

    result = new Array(object.length);

    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];

      keys = Object.keys(pair);

      result[index] = [ keys[0], pair[keys[0]] ];
    }

    return result;
  }

  var pairs = new type('tag:yaml.org,2002:pairs', {
    kind: 'sequence',
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });

  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;

  function resolveYamlSet(data) {
    if (data === null) return true;

    var key, object = data;

    for (key in object) {
      if (_hasOwnProperty$2.call(object, key)) {
        if (object[key] !== null) return false;
      }
    }

    return true;
  }

  function constructYamlSet(data) {
    return data !== null ? data : {};
  }

  var set = new type('tag:yaml.org,2002:set', {
    kind: 'mapping',
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });

  var _default = core.extend({
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set
    ]
  });

  /*eslint-disable max-len,no-use-before-define*/







  var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;


  var CONTEXT_FLOW_IN   = 1;
  var CONTEXT_FLOW_OUT  = 2;
  var CONTEXT_BLOCK_IN  = 3;
  var CONTEXT_BLOCK_OUT = 4;


  var CHOMPING_CLIP  = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP  = 3;


  var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


  function _class(obj) { return Object.prototype.toString.call(obj); }

  function is_EOL(c) {
    return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
  }

  function is_WHITE_SPACE(c) {
    return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
  }

  function is_WS_OR_EOL(c) {
    return (c === 0x09/* Tab */) ||
           (c === 0x20/* Space */) ||
           (c === 0x0A/* LF */) ||
           (c === 0x0D/* CR */);
  }

  function is_FLOW_INDICATOR(c) {
    return c === 0x2C/* , */ ||
           c === 0x5B/* [ */ ||
           c === 0x5D/* ] */ ||
           c === 0x7B/* { */ ||
           c === 0x7D/* } */;
  }

  function fromHexCode(c) {
    var lc;

    if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
      return c - 0x30;
    }

    /*eslint-disable no-bitwise*/
    lc = c | 0x20;

    if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
      return lc - 0x61 + 10;
    }

    return -1;
  }

  function escapedHexLen(c) {
    if (c === 0x78/* x */) { return 2; }
    if (c === 0x75/* u */) { return 4; }
    if (c === 0x55/* U */) { return 8; }
    return 0;
  }

  function fromDecimalCode(c) {
    if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
      return c - 0x30;
    }

    return -1;
  }

  function simpleEscapeSequence(c) {
    /* eslint-disable indent */
    return (c === 0x30/* 0 */) ? '\x00' :
          (c === 0x61/* a */) ? '\x07' :
          (c === 0x62/* b */) ? '\x08' :
          (c === 0x74/* t */) ? '\x09' :
          (c === 0x09/* Tab */) ? '\x09' :
          (c === 0x6E/* n */) ? '\x0A' :
          (c === 0x76/* v */) ? '\x0B' :
          (c === 0x66/* f */) ? '\x0C' :
          (c === 0x72/* r */) ? '\x0D' :
          (c === 0x65/* e */) ? '\x1B' :
          (c === 0x20/* Space */) ? ' ' :
          (c === 0x22/* " */) ? '\x22' :
          (c === 0x2F/* / */) ? '/' :
          (c === 0x5C/* \ */) ? '\x5C' :
          (c === 0x4E/* N */) ? '\x85' :
          (c === 0x5F/* _ */) ? '\xA0' :
          (c === 0x4C/* L */) ? '\u2028' :
          (c === 0x50/* P */) ? '\u2029' : '';
  }

  function charFromCodepoint(c) {
    if (c <= 0xFFFF) {
      return String.fromCharCode(c);
    }
    // Encode UTF-16 surrogate pair
    // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
    return String.fromCharCode(
      ((c - 0x010000) >> 10) + 0xD800,
      ((c - 0x010000) & 0x03FF) + 0xDC00
    );
  }

  var simpleEscapeCheck = new Array(256); // integer, for fast access
  var simpleEscapeMap = new Array(256);
  for (var i = 0; i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }


  function State$1(input, options) {
    this.input = input;

    this.filename  = options['filename']  || null;
    this.schema    = options['schema']    || _default;
    this.onWarning = options['onWarning'] || null;
    // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
    // if such documents have no explicit %YAML directive
    this.legacy    = options['legacy']    || false;

    this.json      = options['json']      || false;
    this.listener  = options['listener']  || null;

    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap       = this.schema.compiledTypeMap;

    this.length     = input.length;
    this.position   = 0;
    this.line       = 0;
    this.lineStart  = 0;
    this.lineIndent = 0;

    // position of first leading tab in the current line,
    // used to make sure there are no tabs in the indentation
    this.firstTabInLine = -1;

    this.documents = [];

    /*
    this.version;
    this.checkLineBreaks;
    this.tagMap;
    this.anchorMap;
    this.tag;
    this.anchor;
    this.kind;
    this.result;*/

  }


  function generateError(state, message) {
    var mark = {
      name:     state.filename,
      buffer:   state.input.slice(0, -1), // omit trailing \0
      position: state.position,
      line:     state.line,
      column:   state.position - state.lineStart
    };

    mark.snippet = snippet(mark);

    return new exception(message, mark);
  }

  function throwError(state, message) {
    throw generateError(state, message);
  }

  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }


  var directiveHandlers = {

    YAML: function handleYamlDirective(state, name, args) {

      var match, major, minor;

      if (state.version !== null) {
        throwError(state, 'duplication of %YAML directive');
      }

      if (args.length !== 1) {
        throwError(state, 'YAML directive accepts exactly one argument');
      }

      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

      if (match === null) {
        throwError(state, 'ill-formed argument of the YAML directive');
      }

      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);

      if (major !== 1) {
        throwError(state, 'unacceptable YAML version of the document');
      }

      state.version = args[0];
      state.checkLineBreaks = (minor < 2);

      if (minor !== 1 && minor !== 2) {
        throwWarning(state, 'unsupported YAML version of the document');
      }
    },

    TAG: function handleTagDirective(state, name, args) {

      var handle, prefix;

      if (args.length !== 2) {
        throwError(state, 'TAG directive accepts exactly two arguments');
      }

      handle = args[0];
      prefix = args[1];

      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
      }

      if (_hasOwnProperty$1.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }

      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
      }

      try {
        prefix = decodeURIComponent(prefix);
      } catch (err) {
        throwError(state, 'tag prefix is malformed: ' + prefix);
      }

      state.tagMap[handle] = prefix;
    }
  };


  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;

    if (start < end) {
      _result = state.input.slice(start, end);

      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 0x09 ||
                (0x20 <= _character && _character <= 0x10FFFF))) {
            throwError(state, 'expected valid JSON character');
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, 'the stream contains non-printable characters');
      }

      state.result += _result;
    }
  }

  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;

    if (!common.isObject(source)) {
      throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
    }

    sourceKeys = Object.keys(source);

    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];

      if (!_hasOwnProperty$1.call(destination, key)) {
        destination[key] = source[key];
        overridableKeys[key] = true;
      }
    }
  }

  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode,
    startLine, startLineStart, startPos) {

    var index, quantity;

    // The output is a plain object here, so keys can only be strings.
    // We need to convert keyNode to a string, but doing so can hang the process
    // (deeply nested arrays that explode exponentially using aliases).
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);

      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, 'nested arrays are not supported inside keys');
        }

        if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
          keyNode[index] = '[object Object]';
        }
      }
    }

    // Avoid code execution in load() via toString property
    // (still use its own toString for arrays, timestamps,
    // and whatever user schema extensions happen to have @@toStringTag)
    if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
      keyNode = '[object Object]';
    }


    keyNode = String(keyNode);

    if (_result === null) {
      _result = {};
    }

    if (keyTag === 'tag:yaml.org,2002:merge') {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json &&
          !_hasOwnProperty$1.call(overridableKeys, keyNode) &&
          _hasOwnProperty$1.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.lineStart = startLineStart || state.lineStart;
        state.position = startPos || state.position;
        throwError(state, 'duplicated mapping key');
      }

      // used for this specific key only because Object.defineProperty is slow
      if (keyNode === '__proto__') {
        Object.defineProperty(_result, keyNode, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: valueNode
        });
      } else {
        _result[keyNode] = valueNode;
      }
      delete overridableKeys[keyNode];
    }

    return _result;
  }

  function readLineBreak(state) {
    var ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x0A/* LF */) {
      state.position++;
    } else if (ch === 0x0D/* CR */) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
        state.position++;
      }
    } else {
      throwError(state, 'a line break is expected');
    }

    state.line += 1;
    state.lineStart = state.position;
    state.firstTabInLine = -1;
  }

  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0,
        ch = state.input.charCodeAt(state.position);

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        if (ch === 0x09/* Tab */ && state.firstTabInLine === -1) {
          state.firstTabInLine = state.position;
        }
        ch = state.input.charCodeAt(++state.position);
      }

      if (allowComments && ch === 0x23/* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
      }

      if (is_EOL(ch)) {
        readLineBreak(state);

        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;

        while (ch === 0x20/* Space */) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }

    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, 'deficient indentation');
    }

    return lineBreaks;
  }

  function testDocumentSeparator(state) {
    var _position = state.position,
        ch;

    ch = state.input.charCodeAt(_position);

    // Condition state.position === state.lineStart is tested
    // in parent on each call, for efficiency. No needs to test here again.
    if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
        ch === state.input.charCodeAt(_position + 1) &&
        ch === state.input.charCodeAt(_position + 2)) {

      _position += 3;

      ch = state.input.charCodeAt(_position);

      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }

    return false;
  }

  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += ' ';
    } else if (count > 1) {
      state.result += common.repeat('\n', count - 1);
    }
  }


  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding,
        following,
        captureStart,
        captureEnd,
        hasPendingContent,
        _line,
        _lineStart,
        _lineIndent,
        _kind = state.kind,
        _result = state.result,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (is_WS_OR_EOL(ch)      ||
        is_FLOW_INDICATOR(ch) ||
        ch === 0x23/* # */    ||
        ch === 0x26/* & */    ||
        ch === 0x2A/* * */    ||
        ch === 0x21/* ! */    ||
        ch === 0x7C/* | */    ||
        ch === 0x3E/* > */    ||
        ch === 0x27/* ' */    ||
        ch === 0x22/* " */    ||
        ch === 0x25/* % */    ||
        ch === 0x40/* @ */    ||
        ch === 0x60/* ` */) {
      return false;
    }

    if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }

    state.kind = 'scalar';
    state.result = '';
    captureStart = captureEnd = state.position;
    hasPendingContent = false;

    while (ch !== 0) {
      if (ch === 0x3A/* : */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following) ||
            withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }

      } else if (ch === 0x23/* # */) {
        preceding = state.input.charCodeAt(state.position - 1);

        if (is_WS_OR_EOL(preceding)) {
          break;
        }

      } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
                 withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;

      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);

        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }

      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }

      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }

      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, captureEnd, false);

    if (state.result) {
      return true;
    }

    state.kind = _kind;
    state.result = _result;
    return false;
  }

  function readSingleQuotedScalar(state, nodeIndent) {
    var ch,
        captureStart, captureEnd;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x27/* ' */) {
      return false;
    }

    state.kind = 'scalar';
    state.result = '';
    state.position++;
    captureStart = captureEnd = state.position;

    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 0x27/* ' */) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);

        if (ch === 0x27/* ' */) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }

      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;

      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, 'unexpected end of the document within a single quoted scalar');

      } else {
        state.position++;
        captureEnd = state.position;
      }
    }

    throwError(state, 'unexpected end of the stream within a single quoted scalar');
  }

  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart,
        captureEnd,
        hexLength,
        hexResult,
        tmp,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x22/* " */) {
      return false;
    }

    state.kind = 'scalar';
    state.result = '';
    state.position++;
    captureStart = captureEnd = state.position;

    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 0x22/* " */) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;

      } else if (ch === 0x5C/* \ */) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);

        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);

          // TODO: rework to inline fn with no type cast?
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;

        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;

          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);

            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;

            } else {
              throwError(state, 'expected hexadecimal character');
            }
          }

          state.result += charFromCodepoint(hexResult);

          state.position++;

        } else {
          throwError(state, 'unknown escape sequence');
        }

        captureStart = captureEnd = state.position;

      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;

      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, 'unexpected end of the document within a double quoted scalar');

      } else {
        state.position++;
        captureEnd = state.position;
      }
    }

    throwError(state, 'unexpected end of the stream within a double quoted scalar');
  }

  function readFlowCollection(state, nodeIndent) {
    var readNext = true,
        _line,
        _lineStart,
        _pos,
        _tag     = state.tag,
        _result,
        _anchor  = state.anchor,
        following,
        terminator,
        isPair,
        isExplicitPair,
        isMapping,
        overridableKeys = Object.create(null),
        keyNode,
        keyTag,
        valueNode,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x5B/* [ */) {
      terminator = 0x5D;/* ] */
      isMapping = false;
      _result = [];
    } else if (ch === 0x7B/* { */) {
      terminator = 0x7D;/* } */
      isMapping = true;
      _result = {};
    } else {
      return false;
    }

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(++state.position);

    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? 'mapping' : 'sequence';
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, 'missed comma between flow collection entries');
      } else if (ch === 0x2C/* , */) {
        // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
        throwError(state, "expected the node content, but found ','");
      }

      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;

      if (ch === 0x3F/* ? */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }

      _line = state.line; // Save the current line.
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }

      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }

      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if (ch === 0x2C/* , */) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }

    throwError(state, 'unexpected end of the stream within a flow collection');
  }

  function readBlockScalar(state, nodeIndent) {
    var captureStart,
        folding,
        chomping       = CHOMPING_CLIP,
        didReadContent = false,
        detectedIndent = false,
        textIndent     = nodeIndent,
        emptyLines     = 0,
        atMoreIndented = false,
        tmp,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x7C/* | */) {
      folding = false;
    } else if (ch === 0x3E/* > */) {
      folding = true;
    } else {
      return false;
    }

    state.kind = 'scalar';
    state.result = '';

    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
        if (CHOMPING_CLIP === chomping) {
          chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, 'repeat of a chomping mode identifier');
        }

      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, 'repeat of an indentation width identifier');
        }

      } else {
        break;
      }
    }

    if (is_WHITE_SPACE(ch)) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (is_WHITE_SPACE(ch));

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (!is_EOL(ch) && (ch !== 0));
      }
    }

    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;

      ch = state.input.charCodeAt(state.position);

      while ((!detectedIndent || state.lineIndent < textIndent) &&
             (ch === 0x20/* Space */)) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }

      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }

      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }

      // End of the scalar.
      if (state.lineIndent < textIndent) {

        // Perform the chomping.
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) { // i.e. only if the scalar is not empty.
            state.result += '\n';
          }
        }

        // Break this `while` cycle and go to the funciton's epilogue.
        break;
      }

      // Folded style: use fancy rules to handle line breaks.
      if (folding) {

        // Lines starting with white space characters (more-indented lines) are not folded.
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          // except for the first content line (cf. Example 8.1)
          state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

        // End of more-indented block.
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat('\n', emptyLines + 1);

        // Just one line break - perceive as the same line.
        } else if (emptyLines === 0) {
          if (didReadContent) { // i.e. only if we have already read some scalar content.
            state.result += ' ';
          }

        // Several line breaks - perceive as different lines.
        } else {
          state.result += common.repeat('\n', emptyLines);
        }

      // Literal style: just add exact number of line breaks between content lines.
      } else {
        // Keep all line breaks except the header line break.
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      }

      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;

      while (!is_EOL(ch) && (ch !== 0)) {
        ch = state.input.charCodeAt(++state.position);
      }

      captureSegment(state, captureStart, state.position, false);
    }

    return true;
  }

  function readBlockSequence(state, nodeIndent) {
    var _line,
        _tag      = state.tag,
        _anchor   = state.anchor,
        _result   = [],
        following,
        detected  = false,
        ch;

    // there is a leading tab before this token, so it can't be a block sequence/mapping;
    // it can still be flow sequence/mapping or a scalar
    if (state.firstTabInLine !== -1) return false;

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(state.position);

    while (ch !== 0) {
      if (state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, 'tab characters must not be used in indentation');
      }

      if (ch !== 0x2D/* - */) {
        break;
      }

      following = state.input.charCodeAt(state.position + 1);

      if (!is_WS_OR_EOL(following)) {
        break;
      }

      detected = true;
      state.position++;

      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }

      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);

      ch = state.input.charCodeAt(state.position);

      if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
        throwError(state, 'bad indentation of a sequence entry');
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }

    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = 'sequence';
      state.result = _result;
      return true;
    }
    return false;
  }

  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following,
        allowCompact,
        _line,
        _keyLine,
        _keyLineStart,
        _keyPos,
        _tag          = state.tag,
        _anchor       = state.anchor,
        _result       = {},
        overridableKeys = Object.create(null),
        keyTag        = null,
        keyNode       = null,
        valueNode     = null,
        atExplicitKey = false,
        detected      = false,
        ch;

    // there is a leading tab before this token, so it can't be a block sequence/mapping;
    // it can still be flow sequence/mapping or a scalar
    if (state.firstTabInLine !== -1) return false;

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(state.position);

    while (ch !== 0) {
      if (!atExplicitKey && state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, 'tab characters must not be used in indentation');
      }

      following = state.input.charCodeAt(state.position + 1);
      _line = state.line; // Save the current line.

      //
      // Explicit notation case. There are two separate blocks:
      // first for the key (denoted by "?") and second for the value (denoted by ":")
      //
      if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

        if (ch === 0x3F/* ? */) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = true;
          allowCompact = true;

        } else if (atExplicitKey) {
          // i.e. 0x3A/* : */ === character after the explicit key.
          atExplicitKey = false;
          allowCompact = true;

        } else {
          throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
        }

        state.position += 1;
        ch = following;

      //
      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
      //
      } else {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;

        if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          // Neither implicit nor explicit notation.
          // Reading is done. Go to the epilogue.
          break;
        }

        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);

          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }

          if (ch === 0x3A/* : */) {
            ch = state.input.charCodeAt(++state.position);

            if (!is_WS_OR_EOL(ch)) {
              throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
            }

            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }

            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;

          } else if (detected) {
            throwError(state, 'can not read an implicit mapping pair; a colon is missed');

          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true; // Keep the result of `composeNode`.
          }

        } else if (detected) {
          throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }
      }

      //
      // Common reading code for both explicit and implicit notations.
      //
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (atExplicitKey) {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
        }

        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }

        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }

      if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
        throwError(state, 'bad indentation of a mapping entry');
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }

    //
    // Epilogue.
    //

    // Special case: last mapping's node contains only the key in explicit notation.
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
    }

    // Expose the resulting mapping.
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = 'mapping';
      state.result = _result;
    }

    return detected;
  }

  function readTagProperty(state) {
    var _position,
        isVerbatim = false,
        isNamed    = false,
        tagHandle,
        tagName,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x21/* ! */) return false;

    if (state.tag !== null) {
      throwError(state, 'duplication of a tag property');
    }

    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x3C/* < */) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);

    } else if (ch === 0x21/* ! */) {
      isNamed = true;
      tagHandle = '!!';
      ch = state.input.charCodeAt(++state.position);

    } else {
      tagHandle = '!';
    }

    _position = state.position;

    if (isVerbatim) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (ch !== 0 && ch !== 0x3E/* > */);

      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, 'unexpected end of the stream within a verbatim tag');
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {

        if (ch === 0x21/* ! */) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);

            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, 'named tag handle cannot contain such characters');
            }

            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, 'tag suffix cannot contain exclamation marks');
          }
        }

        ch = state.input.charCodeAt(++state.position);
      }

      tagName = state.input.slice(_position, state.position);

      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, 'tag suffix cannot contain flow indicator characters');
      }
    }

    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, 'tag name cannot contain such characters: ' + tagName);
    }

    try {
      tagName = decodeURIComponent(tagName);
    } catch (err) {
      throwError(state, 'tag name is malformed: ' + tagName);
    }

    if (isVerbatim) {
      state.tag = tagName;

    } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;

    } else if (tagHandle === '!') {
      state.tag = '!' + tagName;

    } else if (tagHandle === '!!') {
      state.tag = 'tag:yaml.org,2002:' + tagName;

    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }

    return true;
  }

  function readAnchorProperty(state) {
    var _position,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x26/* & */) return false;

    if (state.anchor !== null) {
      throwError(state, 'duplication of an anchor property');
    }

    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (state.position === _position) {
      throwError(state, 'name of an anchor node must contain at least one character');
    }

    state.anchor = state.input.slice(_position, state.position);
    return true;
  }

  function readAlias(state) {
    var _position, alias,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x2A/* * */) return false;

    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (state.position === _position) {
      throwError(state, 'name of an alias node must contain at least one character');
    }

    alias = state.input.slice(_position, state.position);

    if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }

    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }

  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles,
        allowBlockScalars,
        allowBlockCollections,
        indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
        atNewLine  = false,
        hasContent = false,
        typeIndex,
        typeQuantity,
        typeList,
        type,
        flowIndent,
        blockIndent;

    if (state.listener !== null) {
      state.listener('open', state);
    }

    state.tag    = null;
    state.anchor = null;
    state.kind   = null;
    state.result = null;

    allowBlockStyles = allowBlockScalars = allowBlockCollections =
      CONTEXT_BLOCK_OUT === nodeContext ||
      CONTEXT_BLOCK_IN  === nodeContext;

    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }

    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;

          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }

    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }

    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }

      blockIndent = state.position - state.lineStart;

      if (indentStatus === 1) {
        if (allowBlockCollections &&
            (readBlockSequence(state, blockIndent) ||
             readBlockMapping(state, blockIndent, flowIndent)) ||
            readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
              readSingleQuotedScalar(state, flowIndent) ||
              readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;

          } else if (readAlias(state)) {
            hasContent = true;

            if (state.tag !== null || state.anchor !== null) {
              throwError(state, 'alias node should not have any properties');
            }

          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;

            if (state.tag === null) {
              state.tag = '?';
            }
          }

          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        // Special case: block sequences are allowed to have same indentation level as the parent.
        // http://www.yaml.org/spec/1.2/spec.html#id2799784
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }

    if (state.tag === null) {
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }

    } else if (state.tag === '?') {
      // Implicit resolving is not allowed for non-scalar types, and '?'
      // non-specific tag is only automatically assigned to plain scalars.
      //
      // We only need to check kind conformity in case user explicitly assigns '?'
      // tag, for example like this: "!<?> [0]"
      //
      if (state.result !== null && state.kind !== 'scalar') {
        throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
      }

      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (state.tag !== '!') {
      if (_hasOwnProperty$1.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
        type = state.typeMap[state.kind || 'fallback'][state.tag];
      } else {
        // looking for multi type
        type = null;
        typeList = state.typeMap.multi[state.kind || 'fallback'];

        for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
          if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
            type = typeList[typeIndex];
            break;
          }
        }
      }

      if (!type) {
        throwError(state, 'unknown tag !<' + state.tag + '>');
      }

      if (state.result !== null && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result, state.tag)) { // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result, state.tag);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    }

    if (state.listener !== null) {
      state.listener('close', state);
    }
    return state.tag !== null ||  state.anchor !== null || hasContent;
  }

  function readDocument(state) {
    var documentStart = state.position,
        _position,
        directiveName,
        directiveArgs,
        hasDirectives = false,
        ch;

    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = Object.create(null);
    state.anchorMap = Object.create(null);

    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);

      ch = state.input.charCodeAt(state.position);

      if (state.lineIndent > 0 || ch !== 0x25/* % */) {
        break;
      }

      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];

      if (directiveName.length < 1) {
        throwError(state, 'directive name must not be less than one character in length');
      }

      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x23/* # */) {
          do { ch = state.input.charCodeAt(++state.position); }
          while (ch !== 0 && !is_EOL(ch));
          break;
        }

        if (is_EOL(ch)) break;

        _position = state.position;

        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        directiveArgs.push(state.input.slice(_position, state.position));
      }

      if (ch !== 0) readLineBreak(state);

      if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }

    skipSeparationSpace(state, true, -1);

    if (state.lineIndent === 0 &&
        state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
        state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
        state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);

    } else if (hasDirectives) {
      throwError(state, 'directives end mark is expected');
    }

    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);

    if (state.checkLineBreaks &&
        PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, 'non-ASCII line breaks are interpreted as content');
    }

    state.documents.push(state.result);

    if (state.position === state.lineStart && testDocumentSeparator(state)) {

      if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }

    if (state.position < (state.length - 1)) {
      throwError(state, 'end of the stream or a document separator is expected');
    } else {
      return;
    }
  }


  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};

    if (input.length !== 0) {

      // Add tailing `\n` if not exists
      if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
          input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
        input += '\n';
      }

      // Strip BOM
      if (input.charCodeAt(0) === 0xFEFF) {
        input = input.slice(1);
      }
    }

    var state = new State$1(input, options);

    var nullpos = input.indexOf('\0');

    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, 'null byte is not allowed in input');
    }

    // Use 0 as string terminator. That significantly simplifies bounds check.
    state.input += '\0';

    while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
      state.lineIndent += 1;
      state.position += 1;
    }

    while (state.position < (state.length - 1)) {
      readDocument(state);
    }

    return state.documents;
  }


  function loadAll$1(input, iterator, options) {
    if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
      options = iterator;
      iterator = null;
    }

    var documents = loadDocuments(input, options);

    if (typeof iterator !== 'function') {
      return documents;
    }

    for (var index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }


  function load$1(input, options) {
    var documents = loadDocuments(input, options);

    if (documents.length === 0) {
      /*eslint-disable no-undefined*/
      return undefined;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception('expected a single document in the stream, but found more');
  }


  var loadAll_1 = loadAll$1;
  var load_1    = load$1;

  var loader = {
  	loadAll: loadAll_1,
  	load: load_1
  };

  /*eslint-disable no-use-before-define*/





  var _toString       = Object.prototype.toString;
  var _hasOwnProperty = Object.prototype.hasOwnProperty;

  var CHAR_BOM                  = 0xFEFF;
  var CHAR_TAB                  = 0x09; /* Tab */
  var CHAR_LINE_FEED            = 0x0A; /* LF */
  var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
  var CHAR_SPACE                = 0x20; /* Space */
  var CHAR_EXCLAMATION          = 0x21; /* ! */
  var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
  var CHAR_SHARP                = 0x23; /* # */
  var CHAR_PERCENT              = 0x25; /* % */
  var CHAR_AMPERSAND            = 0x26; /* & */
  var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
  var CHAR_ASTERISK             = 0x2A; /* * */
  var CHAR_COMMA                = 0x2C; /* , */
  var CHAR_MINUS                = 0x2D; /* - */
  var CHAR_COLON                = 0x3A; /* : */
  var CHAR_EQUALS               = 0x3D; /* = */
  var CHAR_GREATER_THAN         = 0x3E; /* > */
  var CHAR_QUESTION             = 0x3F; /* ? */
  var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
  var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
  var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
  var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
  var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
  var CHAR_VERTICAL_LINE        = 0x7C; /* | */
  var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

  var ESCAPE_SEQUENCES = {};

  ESCAPE_SEQUENCES[0x00]   = '\\0';
  ESCAPE_SEQUENCES[0x07]   = '\\a';
  ESCAPE_SEQUENCES[0x08]   = '\\b';
  ESCAPE_SEQUENCES[0x09]   = '\\t';
  ESCAPE_SEQUENCES[0x0A]   = '\\n';
  ESCAPE_SEQUENCES[0x0B]   = '\\v';
  ESCAPE_SEQUENCES[0x0C]   = '\\f';
  ESCAPE_SEQUENCES[0x0D]   = '\\r';
  ESCAPE_SEQUENCES[0x1B]   = '\\e';
  ESCAPE_SEQUENCES[0x22]   = '\\"';
  ESCAPE_SEQUENCES[0x5C]   = '\\\\';
  ESCAPE_SEQUENCES[0x85]   = '\\N';
  ESCAPE_SEQUENCES[0xA0]   = '\\_';
  ESCAPE_SEQUENCES[0x2028] = '\\L';
  ESCAPE_SEQUENCES[0x2029] = '\\P';

  var DEPRECATED_BOOLEANS_SYNTAX = [
    'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
    'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
  ];

  var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

  function compileStyleMap(schema, map) {
    var result, keys, index, length, tag, style, type;

    if (map === null) return {};

    result = {};
    keys = Object.keys(map);

    for (index = 0, length = keys.length; index < length; index += 1) {
      tag = keys[index];
      style = String(map[tag]);

      if (tag.slice(0, 2) === '!!') {
        tag = 'tag:yaml.org,2002:' + tag.slice(2);
      }
      type = schema.compiledTypeMap['fallback'][tag];

      if (type && _hasOwnProperty.call(type.styleAliases, style)) {
        style = type.styleAliases[style];
      }

      result[tag] = style;
    }

    return result;
  }

  function encodeHex(character) {
    var string, handle, length;

    string = character.toString(16).toUpperCase();

    if (character <= 0xFF) {
      handle = 'x';
      length = 2;
    } else if (character <= 0xFFFF) {
      handle = 'u';
      length = 4;
    } else if (character <= 0xFFFFFFFF) {
      handle = 'U';
      length = 8;
    } else {
      throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
    }

    return '\\' + handle + common.repeat('0', length - string.length) + string;
  }


  var QUOTING_TYPE_SINGLE = 1,
      QUOTING_TYPE_DOUBLE = 2;

  function State(options) {
    this.schema        = options['schema'] || _default;
    this.indent        = Math.max(1, (options['indent'] || 2));
    this.noArrayIndent = options['noArrayIndent'] || false;
    this.skipInvalid   = options['skipInvalid'] || false;
    this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
    this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
    this.sortKeys      = options['sortKeys'] || false;
    this.lineWidth     = options['lineWidth'] || 80;
    this.noRefs        = options['noRefs'] || false;
    this.noCompatMode  = options['noCompatMode'] || false;
    this.condenseFlow  = options['condenseFlow'] || false;
    this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes   = options['forceQuotes'] || false;
    this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;

    this.tag = null;
    this.result = '';

    this.duplicates = [];
    this.usedDuplicates = null;
  }

  // Indents every line in a string. Empty lines (\n only) are not indented.
  function indentString(string, spaces) {
    var ind = common.repeat(' ', spaces),
        position = 0,
        next = -1,
        result = '',
        line,
        length = string.length;

    while (position < length) {
      next = string.indexOf('\n', position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }

      if (line.length && line !== '\n') result += ind;

      result += line;
    }

    return result;
  }

  function generateNextLine(state, level) {
    return '\n' + common.repeat(' ', state.indent * level);
  }

  function testImplicitResolving(state, str) {
    var index, length, type;

    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type = state.implicitTypes[index];

      if (type.resolve(str)) {
        return true;
      }
    }

    return false;
  }

  // [33] s-white ::= s-space | s-tab
  function isWhitespace(c) {
    return c === CHAR_SPACE || c === CHAR_TAB;
  }

  // Returns true if the character can be printed without escaping.
  // From YAML 1.2: "any allowed characters known to be non-printable
  // should also be escaped. [However,] This isn’t mandatory"
  // Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
  function isPrintable(c) {
    return  (0x00020 <= c && c <= 0x00007E)
        || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
        || ((0x0E000 <= c && c <= 0x00FFFD) && c !== CHAR_BOM)
        ||  (0x10000 <= c && c <= 0x10FFFF);
  }

  // [34] ns-char ::= nb-char - s-white
  // [27] nb-char ::= c-printable - b-char - c-byte-order-mark
  // [26] b-char  ::= b-line-feed | b-carriage-return
  // Including s-white (for some reason, examples doesn't match specs in this aspect)
  // ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
  function isNsCharOrWhitespace(c) {
    return isPrintable(c)
      && c !== CHAR_BOM
      // - b-char
      && c !== CHAR_CARRIAGE_RETURN
      && c !== CHAR_LINE_FEED;
  }

  // [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
  //                             c = flow-in   ⇒ ns-plain-safe-in
  //                             c = block-key ⇒ ns-plain-safe-out
  //                             c = flow-key  ⇒ ns-plain-safe-in
  // [128] ns-plain-safe-out ::= ns-char
  // [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
  // [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
  //                            | ( /* An ns-char preceding */ “#” )
  //                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
  function isPlainSafe(c, prev, inblock) {
    var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
    var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
    return (
      // ns-plain-safe
      inblock ? // c = flow-in
        cIsNsCharOrWhitespace
        : cIsNsCharOrWhitespace
          // - c-flow-indicator
          && c !== CHAR_COMMA
          && c !== CHAR_LEFT_SQUARE_BRACKET
          && c !== CHAR_RIGHT_SQUARE_BRACKET
          && c !== CHAR_LEFT_CURLY_BRACKET
          && c !== CHAR_RIGHT_CURLY_BRACKET
    )
      // ns-plain-char
      && c !== CHAR_SHARP // false on '#'
      && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
      || (isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP) // change to true on '[^ ]#'
      || (prev === CHAR_COLON && cIsNsChar); // change to true on ':[^ ]'
  }

  // Simplified test for values allowed as the first character in plain style.
  function isPlainSafeFirst(c) {
    // Uses a subset of ns-char - c-indicator
    // where ns-char = nb-char - s-white.
    // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
    return isPrintable(c) && c !== CHAR_BOM
      && !isWhitespace(c) // - s-white
      // - (c-indicator ::=
      // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
      && c !== CHAR_MINUS
      && c !== CHAR_QUESTION
      && c !== CHAR_COLON
      && c !== CHAR_COMMA
      && c !== CHAR_LEFT_SQUARE_BRACKET
      && c !== CHAR_RIGHT_SQUARE_BRACKET
      && c !== CHAR_LEFT_CURLY_BRACKET
      && c !== CHAR_RIGHT_CURLY_BRACKET
      // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
      && c !== CHAR_SHARP
      && c !== CHAR_AMPERSAND
      && c !== CHAR_ASTERISK
      && c !== CHAR_EXCLAMATION
      && c !== CHAR_VERTICAL_LINE
      && c !== CHAR_EQUALS
      && c !== CHAR_GREATER_THAN
      && c !== CHAR_SINGLE_QUOTE
      && c !== CHAR_DOUBLE_QUOTE
      // | “%” | “@” | “`”)
      && c !== CHAR_PERCENT
      && c !== CHAR_COMMERCIAL_AT
      && c !== CHAR_GRAVE_ACCENT;
  }

  // Simplified test for values allowed as the last character in plain style.
  function isPlainSafeLast(c) {
    // just not whitespace or colon, it will be checked to be plain character later
    return !isWhitespace(c) && c !== CHAR_COLON;
  }

  // Same as 'string'.codePointAt(pos), but works in older browsers.
  function codePointAt(string, pos) {
    var first = string.charCodeAt(pos), second;
    if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
      second = string.charCodeAt(pos + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }

  // Determines whether block indentation indicator is required.
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }

  var STYLE_PLAIN   = 1,
      STYLE_SINGLE  = 2,
      STYLE_LITERAL = 3,
      STYLE_FOLDED  = 4,
      STYLE_DOUBLE  = 5;

  // Determines which scalar styles are possible and returns the preferred style.
  // lineWidth = -1 => no limit.
  // Pre-conditions: str.length > 0.
  // Post-conditions:
  //    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
  //    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
  //    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth,
    testAmbiguousType, quotingType, forceQuotes, inblock) {

    var i;
    var char = 0;
    var prevChar = null;
    var hasLineBreak = false;
    var hasFoldableLine = false; // only checked if shouldTrackWidth
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1; // count the first line correctly
    var plain = isPlainSafeFirst(codePointAt(string, 0))
            && isPlainSafeLast(codePointAt(string, string.length - 1));

    if (singleLineOnly || forceQuotes) {
      // Case: no block styles.
      // Check for disallowed characters to rule out plain and single.
      for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
    } else {
      // Case: block styles permitted.
      for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          // Check if any line can be folded.
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine ||
              // Foldable line = too long, and not more-indented.
              (i - previousLineBreak - 1 > lineWidth &&
               string[previousLineBreak + 1] !== ' ');
            previousLineBreak = i;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
      // in case the end is missing a \n
      hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
        (i - previousLineBreak - 1 > lineWidth &&
         string[previousLineBreak + 1] !== ' '));
    }
    // Although every style can represent \n without escaping, prefer block styles
    // for multiline, since they're more readable and they don't add empty lines.
    // Also prefer folding a super-long line.
    if (!hasLineBreak && !hasFoldableLine) {
      // Strings interpretable as another type have to be quoted;
      // e.g. the string 'true' vs. the boolean true.
      if (plain && !forceQuotes && !testAmbiguousType(string)) {
        return STYLE_PLAIN;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    // Edge case: block indentation indicator can only have one digit.
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    // At this point we know block styles are valid.
    // Prefer literal style unless we want to fold.
    if (!forceQuotes) {
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }

  // Note: line breaking/folding is implemented for only the folded style.
  // NB. We drop the last trailing newline (if any) of a returned block scalar
  //  since the dumper adds its own newline. This always works:
  //    • No ending newline => unaffected; already using strip "-" chomping.
  //    • Ending newline    => removed then restored.
  //  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
  function writeScalar(state, string, level, iskey, inblock) {
    state.dump = (function () {
      if (string.length === 0) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
      }
      if (!state.noCompatMode) {
        if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? ('"' + string + '"') : ("'" + string + "'");
        }
      }

      var indent = state.indent * Math.max(1, level); // no 0-indent scalars
      // As indentation gets deeper, let the width decrease monotonically
      // to the lower bound min(state.lineWidth, 40).
      // Note that this implies
      //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
      //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
      // This behaves better than a constant minimum width which disallows narrower options,
      // or an indent threshold which causes the width to suddenly increase.
      var lineWidth = state.lineWidth === -1
        ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

      // Without knowing if keys are implicit/explicit, assume implicit for safety.
      var singleLineOnly = iskey
        // No block styles in flow mode.
        || (state.flowLevel > -1 && level >= state.flowLevel);
      function testAmbiguity(string) {
        return testImplicitResolving(state, string);
      }

      switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth,
        testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {

        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return '|' + blockHeader(string, state.indent)
            + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return '>' + blockHeader(string, state.indent)
            + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception('impossible error: invalid scalar style');
      }
    }());
  }

  // Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

    // note the special case: the string '\n' counts as a "trailing" empty line.
    var clip =          string[string.length - 1] === '\n';
    var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
    var chomp = keep ? '+' : (clip ? '' : '-');

    return indentIndicator + chomp + '\n';
  }

  // (See the note for writeScalar.)
  function dropEndingNewline(string) {
    return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
  }

  // Note: a long line without a suitable break point will exceed the width limit.
  // Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
  function foldString(string, width) {
    // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
    // unless they're before or after a more-indented line, or at the very
    // beginning or end, in which case $k$ maps to $k$.
    // Therefore, parse each chunk as newline(s) followed by a content line.
    var lineRe = /(\n+)([^\n]*)/g;

    // first line (possibly an empty line)
    var result = (function () {
      var nextLF = string.indexOf('\n');
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }());
    // If we haven't reached the first content line yet, don't add an extra \n.
    var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
    var moreIndented;

    // rest of the lines
    var match;
    while ((match = lineRe.exec(string))) {
      var prefix = match[1], line = match[2];
      moreIndented = (line[0] === ' ');
      result += prefix
        + (!prevMoreIndented && !moreIndented && line !== ''
          ? '\n' : '')
        + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }

    return result;
  }

  // Greedy line breaking.
  // Picks the longest line under the limit each time,
  // otherwise settles for the shortest line over the limit.
  // NB. More-indented lines *cannot* be folded, as that would add an extra \n.
  function foldLine(line, width) {
    if (line === '' || line[0] === ' ') return line;

    // Since a more-indented line adds a \n, breaks can't be followed by a space.
    var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
    var match;
    // start is an inclusive index. end, curr, and next are exclusive.
    var start = 0, end, curr = 0, next = 0;
    var result = '';

    // Invariants: 0 <= start <= length-1.
    //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
    // Inside the loop:
    //   A match implies length >= 2, so curr and next are <= length-2.
    while ((match = breakRe.exec(line))) {
      next = match.index;
      // maintain invariant: curr - start <= width
      if (next - start > width) {
        end = (curr > start) ? curr : next; // derive end <= length-2
        result += '\n' + line.slice(start, end);
        // skip the space that was output as \n
        start = end + 1;                    // derive start <= length-1
      }
      curr = next;
    }

    // By the invariants, start <= length-1, so there is something left over.
    // It is either the whole string or a part starting from non-whitespace.
    result += '\n';
    // Insert a break if the remainder is too long and there is a break available.
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }

    return result.slice(1); // drop extra \n joiner
  }

  // Escapes a double-quoted string.
  function escapeString(string) {
    var result = '';
    var char = 0;
    var escapeSeq;

    for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      escapeSeq = ESCAPE_SEQUENCES[char];

      if (!escapeSeq && isPrintable(char)) {
        result += string[i];
        if (char >= 0x10000) result += string[i + 1];
      } else {
        result += escapeSeq || encodeHex(char);
      }
    }

    return result;
  }

  function writeFlowSequence(state, level, object) {
    var _result = '',
        _tag    = state.tag,
        index,
        length,
        value;

    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];

      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }

      // Write only valid elements, put null instead of invalid elements.
      if (writeNode(state, level, value, false, false) ||
          (typeof value === 'undefined' &&
           writeNode(state, level, null, false, false))) {

        if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
        _result += state.dump;
      }
    }

    state.tag = _tag;
    state.dump = '[' + _result + ']';
  }

  function writeBlockSequence(state, level, object, compact) {
    var _result = '',
        _tag    = state.tag,
        index,
        length,
        value;

    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];

      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }

      // Write only valid elements, put null instead of invalid elements.
      if (writeNode(state, level + 1, value, true, true, false, true) ||
          (typeof value === 'undefined' &&
           writeNode(state, level + 1, null, true, true, false, true))) {

        if (!compact || _result !== '') {
          _result += generateNextLine(state, level);
        }

        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += '-';
        } else {
          _result += '- ';
        }

        _result += state.dump;
      }
    }

    state.tag = _tag;
    state.dump = _result || '[]'; // Empty sequence if no valid values.
  }

  function writeFlowMapping(state, level, object) {
    var _result       = '',
        _tag          = state.tag,
        objectKeyList = Object.keys(object),
        index,
        length,
        objectKey,
        objectValue,
        pairBuffer;

    for (index = 0, length = objectKeyList.length; index < length; index += 1) {

      pairBuffer = '';
      if (_result !== '') pairBuffer += ', ';

      if (state.condenseFlow) pairBuffer += '"';

      objectKey = objectKeyList[index];
      objectValue = object[objectKey];

      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }

      if (!writeNode(state, level, objectKey, false, false)) {
        continue; // Skip this pair because of invalid key;
      }

      if (state.dump.length > 1024) pairBuffer += '? ';

      pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

      if (!writeNode(state, level, objectValue, false, false)) {
        continue; // Skip this pair because of invalid value.
      }

      pairBuffer += state.dump;

      // Both key and value are valid.
      _result += pairBuffer;
    }

    state.tag = _tag;
    state.dump = '{' + _result + '}';
  }

  function writeBlockMapping(state, level, object, compact) {
    var _result       = '',
        _tag          = state.tag,
        objectKeyList = Object.keys(object),
        index,
        length,
        objectKey,
        objectValue,
        explicitPair,
        pairBuffer;

    // Allow sorting keys so that the output file is deterministic
    if (state.sortKeys === true) {
      // Default sorting
      objectKeyList.sort();
    } else if (typeof state.sortKeys === 'function') {
      // Custom sort function
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      // Something is wrong
      throw new exception('sortKeys must be a boolean or a function');
    }

    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = '';

      if (!compact || _result !== '') {
        pairBuffer += generateNextLine(state, level);
      }

      objectKey = objectKeyList[index];
      objectValue = object[objectKey];

      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }

      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue; // Skip this pair because of invalid key.
      }

      explicitPair = (state.tag !== null && state.tag !== '?') ||
                     (state.dump && state.dump.length > 1024);

      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += '?';
        } else {
          pairBuffer += '? ';
        }
      }

      pairBuffer += state.dump;

      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }

      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue; // Skip this pair because of invalid value.
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ':';
      } else {
        pairBuffer += ': ';
      }

      pairBuffer += state.dump;

      // Both key and value are valid.
      _result += pairBuffer;
    }

    state.tag = _tag;
    state.dump = _result || '{}'; // Empty mapping if no valid pairs.
  }

  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type, style;

    typeList = explicit ? state.explicitTypes : state.implicitTypes;

    for (index = 0, length = typeList.length; index < length; index += 1) {
      type = typeList[index];

      if ((type.instanceOf  || type.predicate) &&
          (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
          (!type.predicate  || type.predicate(object))) {

        if (explicit) {
          if (type.multi && type.representName) {
            state.tag = type.representName(object);
          } else {
            state.tag = type.tag;
          }
        } else {
          state.tag = '?';
        }

        if (type.represent) {
          style = state.styleMap[type.tag] || type.defaultStyle;

          if (_toString.call(type.represent) === '[object Function]') {
            _result = type.represent(object, style);
          } else if (_hasOwnProperty.call(type.represent, style)) {
            _result = type.represent[style](object, style);
          } else {
            throw new exception('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
          }

          state.dump = _result;
        }

        return true;
      }
    }

    return false;
  }

  // Serializes `object` and writes it to global `result`.
  // Returns true on success, or false on invalid object.
  //
  function writeNode(state, level, object, block, compact, iskey, isblockseq) {
    state.tag = null;
    state.dump = object;

    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }

    var type = _toString.call(state.dump);
    var inblock = block;
    var tagStr;

    if (block) {
      block = (state.flowLevel < 0 || state.flowLevel > level);
    }

    var objectOrArray = type === '[object Object]' || type === '[object Array]',
        duplicateIndex,
        duplicate;

    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }

    if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
      compact = false;
    }

    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = '*ref_' + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type === '[object Object]') {
        if (block && (Object.keys(state.dump).length !== 0)) {
          writeBlockMapping(state, level, state.dump, compact);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
          }
        }
      } else if (type === '[object Array]') {
        if (block && (state.dump.length !== 0)) {
          if (state.noArrayIndent && !isblockseq && level > 0) {
            writeBlockSequence(state, level - 1, state.dump, compact);
          } else {
            writeBlockSequence(state, level, state.dump, compact);
          }
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, level, state.dump);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
          }
        }
      } else if (type === '[object String]') {
        if (state.tag !== '?') {
          writeScalar(state, state.dump, level, iskey, inblock);
        }
      } else if (type === '[object Undefined]') {
        return false;
      } else {
        if (state.skipInvalid) return false;
        throw new exception('unacceptable kind of an object to dump ' + type);
      }

      if (state.tag !== null && state.tag !== '?') {
        // Need to encode all characters except those allowed by the spec:
        //
        // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
        // [36] ns-hex-digit    ::=  ns-dec-digit
        //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
        // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
        // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
        // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
        //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
        //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
        //
        // Also need to encode '!' because it has special meaning (end of tag prefix).
        //
        tagStr = encodeURI(
          state.tag[0] === '!' ? state.tag.slice(1) : state.tag
        ).replace(/!/g, '%21');

        if (state.tag[0] === '!') {
          tagStr = '!' + tagStr;
        } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
          tagStr = '!!' + tagStr.slice(18);
        } else {
          tagStr = '!<' + tagStr + '>';
        }

        state.dump = tagStr + ' ' + state.dump;
      }
    }

    return true;
  }

  function getDuplicateReferences(object, state) {
    var objects = [],
        duplicatesIndexes = [],
        index,
        length;

    inspectNode(object, objects, duplicatesIndexes);

    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }

  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList,
        index,
        length;

    if (object !== null && typeof object === 'object') {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);

        if (Array.isArray(object)) {
          for (index = 0, length = object.length; index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);

          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }

  function dump$1(input, options) {
    options = options || {};

    var state = new State(options);

    if (!state.noRefs) getDuplicateReferences(input, state);

    var value = input;

    if (state.replacer) {
      value = state.replacer.call({ '': value }, '', value);
    }

    if (writeNode(state, 0, value, true, true)) return state.dump + '\n';

    return '';
  }

  var dump_1 = dump$1;

  var dumper = {
  	dump: dump_1
  };
  var load                = loader.load;
  var dump                = dumper.dump;

  /**
   * Validates the provided data or throws an error
   * @param typeName {string} The data type to validate
   * @param data {object} The data to validate
   * @returns {boolean} True if valid, throws if invalid
   */
  var validate = function (typeName, data) {
      var validateFn = validators.get(typeName);
      if (!validateFn) {
          throw Error("Validate function not defined for type '" + typeName + "'");
      }
      if (!validateFn(JSON.parse(JSON.stringify(data)))) {
          console.warn(validateFn.errors);
          var firstError = validateFn.errors[0];
          throw new Error(typeName + " is invalid: " + firstError.instancePath + " | " + firstError.schemaPath + " | " + firstError.message + "\n      data: " + JSON.stringify(data, null, 4));
      }
      return true;
  };
  /**
   * Determine if the provided value is an object or a primitive type
   * @param value The data
   * @returns {boolean} True if the provided value is an object
   */
  var isObject = function (value) {
      if (!value)
          return false;
      var type = typeof value;
      return type === 'object';
  };

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Modify the provided object, set the value to 'schedule' property as an instance of Specification.Schedule class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteScheduleIfObject(object) {
      if (isObject(object.schedule)) {
          object.schedule = new Schedule(object.schedule);
      }
  }
  /**
   * Modify the provided object, set the value to 'start' property as an instance of Specification.Startdef class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteStartIfObject(object) {
      if (isObject(object.start)) {
          object.start = new Startdef(object.start);
      }
  }
  /**
   * Modify the provided object, set the value to 'end' property as an instance of Specification.End class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteEndIfObject(object) {
      if (isObject(object.end)) {
          object.end = new End(object.end);
      }
  }
  /**
   * Modify the provided object, set the value to 'cron' property as an instance of Specification.Crondef class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteCronIfObject(object) {
      if (isObject(object.cron)) {
          object.cron = new Crondef(object.cron);
      }
  }
  /**
   * Modify the provided object, set the value to 'transition' property as an instance of Specification.Transition class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteTransitionIfObject(object) {
      if (isObject(object.transition)) {
          object.transition = new Transition(object.transition);
      }
  }
  /**
   * Modify the provided object, set the value to 'defaultCondition' property as an instance of Specification.Defaultconditiondef class
   * @param object to set/overwrite the property
   */
  function overwriteDefaultCondition(object) {
      object.defaultCondition = object.defaultCondition && new Defaultconditiondef(object.defaultCondition);
  }
  /**
   * Modify the provided object, set the value to 'eventConditions' property as an instance of Specification.Eventcondition[] class
   * Throws an error if provided value is neither a Transitioneventcondition nor a Enddeventcondition
   * @param object to set/overwrite the property
   */
  function overwriteEventConditions(object) {
      if (Array.isArray(object.eventConditions)) {
          object.eventConditions = object.eventConditions.map(function (eventCondition) {
              if (eventCondition.transition) {
                  return new Transitioneventcondition(eventCondition);
              }
              if (eventCondition.end) {
                  return new Enddeventcondition(eventCondition);
              }
              throw new Error("Provided value is neither Transitioneventcondition nor Enddeventcondition \n data= " + eventCondition + " ");
          });
      }
  }
  /**
   * Modify the provided object, set the value to 'dataConditions' property as an instance of Specification.Datacondition[] class
   * Throws an error if provided value is neither a Transitiondatacondition nor a Enddatacondition
   * @param object to set/overwrite the property
   */
  function overwriteDataConditions(object) {
      if (Array.isArray(object.dataConditions)) {
          object.dataConditions = object.dataConditions.map(function (dataCondition) {
              if (dataCondition.transition) {
                  return new Transitiondatacondition(dataCondition);
              }
              if (dataCondition.end) {
                  return new Enddatacondition(dataCondition);
              }
              throw new Error("Provided value is neither Transitiondatacondition nor Enddatacondition \n data= " + dataCondition + " ");
          });
      }
  }
  /**
   * Modify the provided object, set the value to 'actions' property as an instance of Specification.Action[] class
   * @param object to set/overwrite the property
   */
  function overwriteActions(object) {
      if (Array.isArray(object.actions)) {
          object.actions = object.actions.map(function (v) { return new Action(v); });
      }
  }
  /**
   * Modify the provided object, set the value to 'onEvents' property as an instance of Specification.Onevents[] class
   * @param object to set/overwrite the property
   */
  function overwriteOnEvents(object) {
      object.onEvents = object.onEvents.map(function (event) { return new Onevents(event); });
  }
  /**
   * Modify the provided object, set the value to 'stateDataFilter' property as an instance of Specification.Statedatafilter class
   * @param object to set/overwrite the property
   */
  function overwriteStateDataFilter(object) {
      object.stateDataFilter = object.stateDataFilter && new Statedatafilter(object.stateDataFilter);
  }
  /**
   * Modify the provided object, set the value to 'metadata' property as an instance of Specification.Metadata class
   * @param object to set/overwrite the property
   */
  function overwriteMetadata(object) {
      object.metadata = object.metadata && new Metadata(object.metadata);
  }
  /**
   * Modify the provided object, set the value to 'retries' property as an instance of Specification.Retries class
   * @param object to set/overwrite the property
   */
  function overwriteRetries(object) {
      if (Array.isArray(object.retries)) {
          object.retries = object.retries.map(function (f) { return new Retrydef(f); });
      }
  }
  /**
   * Modify the provided object, set the value to 'events' property as an instance of Specification.Events class
   * @param object to set/overwrite the property
   */
  function overwriteEvents(object) {
      if (Array.isArray(object.events)) {
          object.events = object.events.map(function (f) { return new Eventdef(f); });
      }
  }
  /**
   * Modify the provided object, set the value to 'errors' property as an instance of Specification.Errors class
   * @param object to set/overwrite the property
   */
  function overwriteErrors(object) {
      if (Array.isArray(object.errors)) {
          object.errors = object.errors.map(function (f) { return new Errordef(f); });
      }
  }
  /**
   * Modify the provided object, set the value to 'auth' property as an instance of Specification.Auth class
   * @param object to set/overwrite the property
   */
  function overwriteAuth(object) {
      if (Array.isArray(object.auth)) {
          object.auth = object.auth.map(function (f) { return new Authdef(f); });
      }
  }
  /**
   * Modify the provided object, set the value to 'functions' property as an instance of Specification.Functions class
   * @param object to set/overwrite the property
   */
  function overwriteFunctions(object) {
      if (Array.isArray(object.functions)) {
          object.functions = object.functions.map(function (f) { return new Function$1(f); });
      }
  }
  /**
   * Modify the provided object, set the value to 'states' property as an instance of Specification.States class
   * Throws an error if the value of the property type is not handler
   * @param object to set/overwrite the property
   */
  function overwriteStates(object) {
      object.states =
          object.states &&
              object.states.map(function (v) {
                  switch (v.type) {
                      case 'sleep':
                          return new Sleepstate(v);
                      case 'event':
                          return new Eventstate(v);
                      case 'operation':
                          return new Operationstate(v);
                      case 'parallel':
                          return new Parallelstate(v);
                      case 'switch':
                          var switchState = v;
                          if (switchState.dataConditions) {
                              return new Databasedswitch(v);
                          }
                          if (switchState.eventConditions) {
                              return new Eventbasedswitch(v);
                          }
                          throw new Error("Unexpected switch type; \n state value= " + JSON.stringify(v, null, 4));
                      case 'inject':
                          return new Injectstate(v);
                      case 'foreach':
                          return new Foreachstate(v);
                      case 'callback':
                          return new Callbackstate(v);
                      default:
                          throw new Error("Unexpected type= " + v.type + "; \n state value= " + JSON.stringify(v, null, 4));
                  }
              });
  }
  /**
   * Modify the provided object, set the value to 'properties' property as an instance of Specification.Properties class, if the provided value is an object
   * Throws an error if the value of the property type is not handler
   * @param object to set/overwrite the property
   */
  function overwritePropertiesIfObject(object) {
      if (isObject(object.properties)) {
          var properties = object.properties;
          if (properties.username && properties.password) {
              object.properties = new Basicpropsdef(object);
          }
          if (properties.token) {
              object.properties = new Bearerpropsdef(object);
          }
          if (properties.grantType) {
              object.properties = new Oauth2propsdef(object);
          }
      }
  }
  /**
   * Modify the provided object, set the value to 'correlation' property as an instance of Specification.CorrelationDefs class
   * @param object to set/overwrite the property
   */
  function overwriteCorrelation(object) {
      if (Array.isArray(object.correlation)) {
          object.correlation = object.correlation.map(function (correlation) { return new CorrelationDef(correlation); });
      }
  }
  /**
   * Modify the provided object, set the value to 'action' property as an instance of Specification.Action class
   * @param object to set/overwrite the property
   */
  function overwriteAction(object) {
      object.action = object.action && new Action(object.action);
  }
  /**
   * Modify the provided object, set the value to 'workflowExecTimeout' property as an instance of Specification.WorkflowExecTimeout class
   * @param object to set/overwrite the property
   */
  function overwriteWorkflowExecTimeout(object) {
      object.workflowExecTimeout =
          object.workflowExecTimeout && new WorkflowExecTimeout(object.workflowExecTimeout);
  }
  /**
   * Modify the provided object, set the value to 'stateExecTimeout' property as an instance of Specification.StateExecTimeout class
   * @param object to set/overwrite the property
   */
  function overwriteStateExecTimeout(object) {
      object.stateExecTimeout = object.stateExecTimeout && new StateExecTimeout(object.stateExecTimeout);
  }
  /**
   * Modify the provided object, set the value to 'eventDataFilter' property as an instance of Specification.Eventdatafilter class
   * @param object to set/overwrite the property
   */
  function overwriteEventDataFilter(object) {
      object.eventDataFilter = object.eventDataFilter && new Eventdatafilter(object.eventDataFilter);
  }
  /**
   * Modify the provided object, set the value to 'onErrors' property as an instance of Specification.Error[] class
   * @param object to set/overwrite the property
   */
  function overwriteOnErrors(object) {
      if (Array.isArray(object.onErrors)) {
          object.onErrors = object.onErrors.map(function (error) { return new Error$1(error); });
      }
  }
  /**
   * Modify the provided object, set the value to 'branches' property as an instance of Specification.Branch[] class
   * @param object to set/overwrite the property
   */
  function overwriteBranches(object) {
      if (Array.isArray(object.branches)) {
          object.branches = object.branches.map(function (v) { return new Branch(v); });
      }
  }
  /**
   * Modify the provided object, set the value to 'produceEvents' property as an instance of Specification.Produceeventdef[] class
   * @param object to set/overwrite the property
   */
  function overwriteProduceEvents(object) {
      if (Array.isArray(object.produceEvents)) {
          object.produceEvents = object.produceEvents.map(function (produceEvent) { return new Produceeventdef(produceEvent); });
      }
  }
  /**
   * Modify the provided object, set the value to 'functionRef' property as an instance of Specification.Functionref class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteFunctionRefIfObject(object) {
      if (isObject(object.functionRef)) {
          object.functionRef = new Functionref(object.functionRef);
      }
  }
  /**
   * Modify the provided object, set the value to 'continueAs' property as an instance of Specification. Continueasdef, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteContinueAsIfObject(object) {
      if (isObject(object.continueAs)) {
          object.continueAs = new Continueasdef(object.continueAs);
      }
  }
  /**
   * Modify the provided object, set the value to 'subFlowRef' property as an instance of Specification.Subflowref class, if the provided value is an object
   * @param object to set/overwrite the property
   */
  function overwriteSubFlowRefIfObject(object) {
      if (isObject(object.subFlowRef)) {
          object.subFlowRef = new Subflowref(object.subFlowRef);
      }
  }
  /**
   * Modify the provided object, set the value to 'eventRef' property as an instance of Specification.Eventref class
   * @param object to set/overwrite the property
   */
  function overwriteEventRef(object) {
      object.eventRef = object.eventRef && new Eventref(object.eventRef);
  }
  /**
   * Modify the provided object, set the value to 'sleep' property as an instance of Specification.Sleep class
   * @param object to set/overwrite the property
   */
  function overwriteSleep(object) {
      object.sleep = object.sleep && new Sleep(object.sleep);
  }
  /**
   * Modify the provided object, set the value to 'actionDataFilter' property as an instance of Specification.Actiondatafilter class
   * @param object to set/overwrite the property
   */
  function overwriteActionDataFilter(object) {
      object.actionDataFilter = object.actionDataFilter && new Actiondatafilter(object.actionDataFilter);
  }
  /**
   * Set end to true if neither nor transition properties are defined
   * @param object to modify
   */
  function setEndValueIfNoTransition(object) {
      if (!object.end && !object.transition) {
          object.end = true;
      }
  }
  /**
   * Modify the provided object by normalizing the 'end' property.
   * @param object to be modified
   */
  function normalizeEndIfObject(object) {
      if (isObject(object.end)) {
          object.end = object.end.normalize();
      }
  }
  /**
   * Modify the provided object, deep cloning the value of the provided property
   * @param property to be cloned
   * @param object to set/overwrite the property
   */
  function overwritePropertyAsPlainType(property, object) {
      var _a;
      if (isObject(object[property])) {
          Object.assign(object, (_a = {}, _a[property] = JSON.parse(JSON.stringify(object[property])), _a));
      }
  }
  /**
   * Modify the provided object, set the value to 'timeouts.stateExecTimeout' property as an instance of Specification.StateExecTimeout class,
   * for the rest of the properties the value is cloned
   * @param object to set/overwrite the property
   */
  function overwriteTimeoutWithStateExecTimeout(object) {
      overwritePropertyAsPlainType('timeouts', object);
      var timeouts = object.timeouts;
      if (timeouts && isObject(timeouts.stateExecTimeout)) {
          timeouts.stateExecTimeout = new StateExecTimeout(timeouts.stateExecTimeout);
      }
  }
  /**
   * Modify the provided object, set the value to 'timeouts' property as an instance of Specification.Timeouts class
   * @param object to set/overwrite the property
   */
  function overwriteTimeoutsIfObject(object) {
      if (isObject(object.timeouts)) {
          object.timeouts = object.timeouts && new Timeouts(object.timeouts);
      }
  }
  /**
   * Modify the provided object by normalizing the 'subFlowRef' property.
   * @param object to be modified
   */
  function normalizeSubFlowRefIfObject(object) {
      if (isObject(object.subFlowRef)) {
          object.subFlowRef = object.subFlowRef.normalize();
      }
  }
  /**
   * Modify the provided object by normalizing the 'continueAs' property.
   * @param object to be modified
   */
  function normalizeContinueAsIfObject(object) {
      if (isObject(object.continueAs)) {
          object.continueAs = object.continueAs.normalize();
      }
  }
  /**
   * Modify the provided object by normalizing the 'defaultCondition' property.
   * @param object to be modified
   */
  function normalizeDefaultCondition(object) {
      object.defaultCondition = object.defaultCondition && object.defaultCondition.normalize();
  }
  /**
   * Modify the provided object by normalizing the 'workflowExecTimeout' property.
   * @param object to be modified
   */
  function normalizeWorkflowExecTimeout(object) {
      object.workflowExecTimeout = object.workflowExecTimeout && object.workflowExecTimeout.normalize();
  }
  /**
   * Modify the provided object by normalizing the 'actionMode' property, where the default value is 'sequential'.
   * @param object to be modified
   */
  function normalizeActionMode(object) {
      if (object.actionMode === 'sequential') {
          delete object.actionMode;
      }
  }
  /**
   * Modify the provided object by normalizing the 'completionType' property, where the default value is 'allOf'.
   * @param object to be modified
   */
  function normalizeCompletionType(object) {
      if (object.completionType === 'allOf') {
          delete object.completionType;
      }
  }
  /**
   * Modify the provided object by normalizing the 'usedForCompensation' property, where the default value is 'false'.
   * @param object to be modified
   */
  function normalizeUsedForCompensation(object) {
      if (!object.usedForCompensation) {
          delete object.usedForCompensation;
      }
  }
  /**
   * Modify the provided object by normalizing the 'mode' property, where the default value is 'parallel'.
   * @param object to be modified
   */
  function normalizeMode(object) {
      if (object.mode === 'parallel') {
          delete object.mode;
      }
  }
  /**
   * Modify the provided object by normalizing the 'onEvents' property.
   * @param object to be modified
   */
  function normalizeOnEvents(object) {
      object.onEvents = object.onEvents && object.onEvents.map(function (onEvent) { return onEvent.normalize(); });
  }
  /**
   * Modify the provided object by normalizing the 'onErrors' property.
   * @param object to be modified
   */
  function normalizeOnErrors(object) {
      if (Array.isArray(object.onErrors)) {
          object.onErrors = object.onErrors.map(function (error) { return error.normalize(); });
      }
  }
  /**
   * Modify the provided object by normalizing the 'branches' property.
   * @param object to be modified
   */
  function normalizeBranches(object) {
      if (Array.isArray(object.branches)) {
          object.branches = object.branches.map(function (branch) { return branch.normalize(); });
      }
  }
  /**
   * Modify the provided object by normalizing the 'actions' property.
   * @param object to be modified
   */
  function normalizeActions(object) {
      if (Array.isArray(object.actions)) {
          object.actions = object.actions.map(function (action) { return action.normalize(); });
      }
  }
  /**
   * Modify the provided object by normalizing the 'action' property.
   * @param object to be modified
   */
  function normalizeAction(object) {
      object.action = object.action && object.action.normalize();
  }
  /**
   * Modify the provided object by normalizing the 'dataConditions' property.
   * @param object to be modified
   */
  function normalizeDataConditions(object) {
      if (Array.isArray(object.dataConditions)) {
          object.dataConditions = object.dataConditions.map(function (dc) { return dc.normalize(); });
      }
  }
  /**
   * Modify the provided object by normalizing the 'eventConditions' property.
   * @param object to be modified
   */
  function normalizeEventConditions(object) {
      if (Array.isArray(object.eventConditions)) {
          object.eventConditions = object.eventConditions.map(function (event) { return event.normalize(); });
      }
  }
  /**
   * Modify the provided object by normalizing the 'transition' property if property type is Specification.Transition.
   * @param object to be modified
   */
  function normalizeTransitionIfObject(object) {
      if (isObject(object.transition)) {
          object.transition = object.transition.normalize();
      }
  }
  /**
   * Modify the provided object by normalizing the 'compensate' property, where the default value is 'false'.
   * @param object to be modified
   */
  function normalizeCompensate(object) {
      if (!object.compensate) {
          delete object.compensate;
      }
  }
  /**
   * Modify the provided object by normalizing the 'scheme' property, where the default value is 'basic'.
   * @param object to be modified
   */
  function normalizeScheme(object) {
      if (object.scheme === 'basic') {
          delete object.scheme;
      }
  }
  /**
   * Modify the provided object by normalizing the 'terminate' property, where the default value is 'false'.
   * @param object to be modified
   */
  function normalizeTerminate(object) {
      if (!object.terminate) {
          delete object.terminate;
      }
  }
  /**
   * Modify the provided object by normalizing the 'exclusive' property, where the default value is 'true'.
   * @param object to be modified
   */
  function normalizeExclusive(object) {
      if (object.exclusive) {
          delete object.exclusive;
      }
  }
  /**
   * Modify the provided object by normalizing the 'keepActive' property, where the default value is 'true'.
   * @param object to be modified
   */
  function normalizeKeepActive(object) {
      if (object.keepActive) {
          delete object.keepActive;
      }
  }
  /**
   * Modify the provided object by normalizing the 'expressionLang' property, where the default value is 'jq'.
   * @param object to be modified
   */
  function normalizeExpressionLang(object) {
      if (object.expressionLang === 'jq') {
          delete object.expressionLang;
      }
  }
  /**
   * Modify the provided object by normalizing the 'interrupt' property, where the default value is 'true'.
   * @param object to be modified
   */
  function normalizeInterrupt(object) {
      if (object.interrupt) {
          delete object.interrupt;
      }
  }
  /**
   * Modify the provided object by normalizing the 'type' property, where the default value is 'rest'.
   * @param object to be modified
   */
  function normalizeType(object) {
      if (object.type === 'rest') {
          delete object.type;
      }
  }
  /**
   * Modify the provided object by normalizing the 'kind' property, where the default value is 'consumed'.
   * @param object to be modified
   */
  function normalizeKind(object) {
      if (object.kind === 'consumed') {
          delete object.kind;
      }
  }
  /**
   * Modify the provided object by normalizing the 'dataOnly' property, where the default value is 'true'.
   * @param object to be modified
   */
  function normalizeDataOnly(object) {
      if (object.dataOnly) {
          delete object.dataOnly;
      }
  }
  /**
   * Modify the provided object by normalizing the 'states' property.
   * @param object to be modified
   */
  function normalizeStates(object) {
      object.states = object.states.map(function (state) {
          return state.normalize();
      });
  }
  /**
   * Modify the provided object by normalizing the 'auth' property.
   * @param object to be modified
   */
  function normalizeAuth(object) {
      if (Array.isArray(object.auth)) {
          object.auth = object.auth.map(function (auth) {
              return auth.normalize();
          });
      }
  }
  /**
   * Modify the provided object by normalizing the 'functions' property.
   * @param object to be modified
   */
  function normalizeFunctions(object) {
      if (Array.isArray(object.functions)) {
          object.functions = object.functions.map(function (f) {
              return f.normalize();
          });
      }
  }
  /**
   * Modify the provided object by normalizing the 'events' property.
   * @param object to be modified
   */
  function normalizeEvents(object) {
      if (Array.isArray(object.events)) {
          object.events = object.events.map(function (event) {
              return event.normalize();
          });
      }
  }
  /**
   * Modify the provided object by normalizing the 'timeouts' property.
   * @param object to be modified
   */
  function normalizeTimeoutsIfObject(object) {
      if (isObject(object.timeouts)) {
          object.timeouts = object.timeouts && object.timeouts.normalize();
      }
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Workflow = /** @class */ (function () {
      function Workflow(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Workflow} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Workflow(_this);
              normalizeExpressionLang(clone);
              normalizeTimeoutsIfObject(clone);
              normalizeKeepActive(clone);
              normalizeEvents(clone);
              normalizeFunctions(clone);
              normalizeAuth(clone);
              normalizeStates(clone);
              return clone;
          };
          var defaultModel = {
              expressionLang: 'jq',
              keepActive: true,
          };
          Object.assign(this, defaultModel, model);
          overwritePropertyAsPlainType('dataInputSchema', this);
          overwritePropertyAsPlainType('constants', this);
          overwriteStartIfObject(this);
          overwriteTimeoutsIfObject(this);
          overwriteErrors(this);
          overwriteMetadata(this);
          overwriteEvents(this);
          overwriteFunctions(this);
          overwriteRetries(this);
          overwriteAuth(this);
          overwriteStates(this);
      }
      /**
       * Parses the provided string as Workflow
       * @param {string} data The JSON or YAML workflow to parse
       * @returns {Workflow} The parse Workflow
       */
      Workflow.fromSource = function (value) {
          try {
              var model = load(value);
              return new Workflow(model);
          }
          catch (ex) {
              throw new Error('Format not supported');
          }
      };
      /**
       * Stringifies the provided workflow to the JSON format
       * @param {Workflow} workflow The workflow to strigify
       * @returns {string} The workflow as JSON
       */
      Workflow.toJson = function (workflow) {
          validate('Workflow', workflow);
          return JSON.stringify(workflow.normalize());
      };
      /**
       * Stringifies the provided workflow to the YAML format
       * @param {Workflow} workflow The workflow to strigify
       * @returns {string} The workflow as YAML
       */
      Workflow.toYaml = function (workflow) {
          validate('Workflow', workflow);
          return dump(JSON.parse(JSON.stringify(workflow.normalize())));
      };
      return Workflow;
  }());

  var Action = /** @class */ (function () {
      function Action(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Action} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Action(_this);
              normalizeSubFlowRefIfObject(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteFunctionRefIfObject(this);
          overwriteEventRef(this);
          overwriteSubFlowRefIfObject(this);
          overwriteSleep(this);
          overwriteActionDataFilter(this);
      }
      return Action;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Actiondatafilter = /** @class */ (function () {
      function Actiondatafilter(model) {
          Object.assign(this, model);
      }
      return Actiondatafilter;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Authdef = /** @class */ (function () {
      function Authdef(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Authdef} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Authdef(_this);
              normalizeScheme(clone);
              return clone;
          };
          var defaultModel = { scheme: 'basic' };
          Object.assign(this, defaultModel, model);
          overwritePropertiesIfObject(this);
      }
      return Authdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Basicpropsdef = /** @class */ (function () {
      function Basicpropsdef(model) {
          Object.assign(this, model);
          overwriteMetadata(this);
      }
      return Basicpropsdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Bearerpropsdef = /** @class */ (function () {
      function Bearerpropsdef(model) {
          Object.assign(this, model);
          overwriteMetadata(this);
      }
      return Bearerpropsdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Branch /* Branch Definition */ = /** @class */ (function () {
      function Branch(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Action} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Branch(_this);
              normalizeActions(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteActions(this);
          overwritePropertyAsPlainType('timeouts', this);
      }
      return Branch;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Callbackstate = /** @class */ (function () {
      function Callbackstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Callbackstate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Callbackstate(_this);
              normalizeAction(clone);
              normalizeOnErrors(clone);
              normalizeTransitionIfObject(clone);
              normalizeEndIfObject(clone);
              normalizeUsedForCompensation(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = { type: 'callback', usedForCompensation: false };
          Object.assign(this, defaultModel, model);
          overwriteAction(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteEventDataFilter(this);
          overwriteStateDataFilter(this);
          overwriteOnErrors(this);
          overwriteTransitionIfObject(this);
          overwriteEndIfObject(this);
          overwriteMetadata(this);
      }
      return Callbackstate;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   */
  var Continueasdef = /** @class */ (function () {
      function Continueasdef(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Exectimeout} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Continueasdef(_this);
              normalizeWorkflowExecTimeout(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteWorkflowExecTimeout(this);
          overwritePropertyAsPlainType('data', this);
      }
      return Continueasdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var CorrelationDef = /** @class */ (function () {
      function CorrelationDef(model) {
          Object.assign(this, model);
      }
      return CorrelationDef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Crondef = /** @class */ (function () {
      function Crondef(model) {
          Object.assign(this, model);
      }
      return Crondef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Databasedswitch = /** @class */ (function () {
      function Databasedswitch(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Databasedswitch} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Databasedswitch(_this);
              normalizeDataConditions(clone);
              normalizeOnErrors(clone);
              normalizeDefaultCondition(clone);
              normalizeUsedForCompensation(clone);
              return clone;
          };
          var defaultModel = { type: 'switch', usedForCompensation: false };
          Object.assign(this, defaultModel, model);
          overwriteStateDataFilter(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteDataConditions(this);
          overwriteOnErrors(this);
          overwriteDefaultCondition(this);
          overwriteMetadata(this);
      }
      return Databasedswitch;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Defaultconditiondef /* DefaultCondition definition. Can be either a transition or end definition */ = /** @class */ (function () {
      function Defaultconditiondef(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Defaultdef} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Defaultconditiondef(_this);
              normalizeEndIfObject(clone);
              normalizeTransitionIfObject(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteTransitionIfObject(this);
          overwriteEndIfObject(this);
      }
      return Defaultconditiondef;
  }());

  var End = /** @class */ (function () {
      function End(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.End} without deleted properties.
           */
          this.normalize = function () {
              var clone = new End(_this);
              normalizeCompensate(clone);
              normalizeTerminate(clone);
              normalizeContinueAsIfObject(clone);
              return clone;
          };
          var defaultModel = {
              compensate: false,
              terminate: false,
          };
          Object.assign(this, defaultModel, model);
          overwriteProduceEvents(this);
          overwriteContinueAsIfObject(this);
      }
      return End;
  }());

  var Enddatacondition = /** @class */ (function () {
      function Enddatacondition(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Enddatacondition} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Enddatacondition(_this);
              normalizeEndIfObject(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteEndIfObject(this);
          overwriteMetadata(this);
      }
      return Enddatacondition;
  }());

  var Enddeventcondition = /** @class */ (function () {
      function Enddeventcondition(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Enddeventcondition} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Enddeventcondition(_this);
              normalizeEndIfObject(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteEndIfObject(this);
          overwriteEventDataFilter(this);
          overwriteMetadata(this);
      }
      return Enddeventcondition;
  }());

  var Error$1 = /** @class */ (function () {
      function Error(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Error} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Error(_this);
              normalizeEndIfObject(clone);
              normalizeTransitionIfObject(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteTransitionIfObject(this);
          overwriteEndIfObject(this);
      }
      return Error;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Errordef = /** @class */ (function () {
      function Errordef(model) {
          Object.assign(this, model);
      }
      return Errordef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Eventbasedswitch = /** @class */ (function () {
      function Eventbasedswitch(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Eventbasedswitch} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Eventbasedswitch(_this);
              normalizeEventConditions(clone);
              normalizeOnErrors(clone);
              normalizeDefaultCondition(clone);
              normalizeUsedForCompensation(clone);
              return clone;
          };
          var defaultModel = {
              type: 'switch',
              usedForCompensation: false,
          };
          Object.assign(this, defaultModel, model);
          overwriteStateDataFilter(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteEventConditions(this);
          overwriteOnErrors(this);
          overwriteDefaultCondition(this);
          overwriteMetadata(this);
      }
      return Eventbasedswitch;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Eventdatafilter = /** @class */ (function () {
      function Eventdatafilter(model) {
          Object.assign(this, model);
      }
      return Eventdatafilter;
  }());

  var Eventdef = /** @class */ (function () {
      function Eventdef(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Eventdef} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Eventdef(_this);
              normalizeKind(clone);
              normalizeDataOnly(clone);
              return clone;
          };
          var defaultModel = {
              kind: 'consumed',
              dataOnly: true,
          };
          Object.assign(this, defaultModel, model);
          overwriteCorrelation(this);
          overwriteMetadata(this);
      }
      return Eventdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Eventref = /** @class */ (function () {
      function Eventref(model) {
          Object.assign(this, model);
          overwritePropertyAsPlainType('data', this);
          overwritePropertyAsPlainType('contextAttributes', this);
      }
      return Eventref;
  }());

  var Eventstate /* This state is used to wait for events from event sources, then consumes them and invoke one or more actions to run in sequence or parallel */ = /** @class */ (function () {
      function Eventstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Eventstate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Eventstate(_this);
              normalizeExclusive(clone);
              normalizeOnEvents(clone);
              normalizeOnErrors(clone);
              normalizeTransitionIfObject(clone);
              normalizeEndIfObject(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = { type: 'event', exclusive: true };
          Object.assign(this, defaultModel, model);
          overwriteOnEvents(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteStateDataFilter(this);
          overwriteOnErrors(this);
          overwriteTransitionIfObject(this);
          overwriteEndIfObject(this);
          overwriteMetadata(this);
      }
      return Eventstate;
  }());

  var Foreachstate = /** @class */ (function () {
      function Foreachstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Foreachstate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Foreachstate(_this);
              normalizeEndIfObject(clone);
              normalizeActions(clone);
              normalizeOnErrors(clone);
              normalizeTransitionIfObject(clone);
              normalizeUsedForCompensation(clone);
              normalizeMode(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = { type: 'foreach', usedForCompensation: false, mode: 'parallel' };
          Object.assign(this, defaultModel, model);
          overwriteEndIfObject(this);
          overwriteActions(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteStateDataFilter(this);
          overwriteOnErrors(this);
          overwriteTransitionIfObject(this);
          overwriteMetadata(this);
      }
      return Foreachstate;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Function$1 = /** @class */ (function () {
      function Function(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Function} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Function(_this);
              normalizeType(clone);
              return clone;
          };
          var defaultModel = { type: 'rest' };
          Object.assign(this, defaultModel, model);
          overwriteMetadata(this);
      }
      return Function;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Functionref = /** @class */ (function () {
      function Functionref(model) {
          Object.assign(this, model);
          overwritePropertyAsPlainType('arguments', this);
      }
      return Functionref;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Injectstate = /** @class */ (function () {
      function Injectstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Injectstate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Injectstate(_this);
              normalizeEndIfObject(clone);
              normalizeTransitionIfObject(clone);
              normalizeUsedForCompensation(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = { type: 'inject', usedForCompensation: false };
          Object.assign(this, defaultModel, model);
          overwriteEndIfObject(this);
          overwritePropertyAsPlainType('data', this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteStateDataFilter(this);
          overwriteTransitionIfObject(this);
          overwriteMetadata(this);
      }
      return Injectstate;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Metadata = /** @class */ (function () {
      function Metadata(model) {
          Object.assign(this, model);
      }
      return Metadata;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Oauth2propsdef = /** @class */ (function () {
      function Oauth2propsdef(model) {
          Object.assign(this, model);
          overwriteMetadata(this);
      }
      return Oauth2propsdef;
  }());

  var Onevents = /** @class */ (function () {
      function Onevents(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Onevents} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Onevents(_this);
              normalizeActionMode(clone);
              normalizeActions(clone);
              return clone;
          };
          var defaultModel = { actionMode: 'sequential' };
          Object.assign(this, defaultModel, model);
          overwriteActions(this);
          overwriteEventDataFilter(this);
      }
      return Onevents;
  }());

  var Operationstate = /** @class */ (function () {
      function Operationstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Operationstate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Operationstate(_this);
              normalizeEndIfObject(clone);
              normalizeActionMode(clone);
              normalizeActions(clone);
              normalizeOnErrors(clone);
              normalizeTransitionIfObject(clone);
              normalizeUsedForCompensation(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = {
              type: 'operation',
              actionMode: 'sequential',
              usedForCompensation: false,
          };
          Object.assign(this, defaultModel, model);
          overwriteEndIfObject(this);
          overwriteStateDataFilter(this);
          overwriteActions(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteOnErrors(this);
          overwriteTransitionIfObject(this);
          overwriteMetadata(this);
      }
      return Operationstate;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Parallelstate = /** @class */ (function () {
      function Parallelstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Parallelstate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Parallelstate(_this);
              normalizeEndIfObject(clone);
              normalizeBranches(clone);
              normalizeCompletionType(clone);
              normalizeOnErrors(clone);
              normalizeTransitionIfObject(clone);
              normalizeUsedForCompensation(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = {
              type: 'parallel',
              completionType: 'allOf',
              usedForCompensation: false,
          };
          Object.assign(this, defaultModel, model);
          overwriteEndIfObject(this);
          overwriteStateDataFilter(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteBranches(this);
          overwriteOnErrors(this);
          overwriteTransitionIfObject(this);
          overwriteMetadata(this);
      }
      return Parallelstate;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Produceeventdef = /** @class */ (function () {
      function Produceeventdef(model) {
          Object.assign(this, model);
          overwritePropertyAsPlainType('data', this);
          overwritePropertyAsPlainType('contextAttributes', this);
      }
      return Produceeventdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Retrydef = /** @class */ (function () {
      function Retrydef(model) {
          Object.assign(this, model);
      }
      return Retrydef;
  }());

  var Schedule = /** @class */ (function () {
      function Schedule(model) {
          Object.assign(this, model);
          overwriteCronIfObject(this);
      }
      return Schedule;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Sleep = /** @class */ (function () {
      function Sleep(model) {
          Object.assign(this, model);
      }
      return Sleep;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Sleepstate = /** @class */ (function () {
      function Sleepstate(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Delaystate} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Sleepstate(_this);
              normalizeEndIfObject(clone);
              normalizeOnErrors(clone);
              normalizeTransitionIfObject(clone);
              normalizeUsedForCompensation(clone);
              setEndValueIfNoTransition(clone);
              return clone;
          };
          var defaultModel = {
              type: 'sleep',
              usedForCompensation: false,
          };
          Object.assign(this, defaultModel, model);
          overwriteEndIfObject(this);
          overwriteStateDataFilter(this);
          overwriteTimeoutWithStateExecTimeout(this);
          overwriteOnErrors(this);
          overwriteTransitionIfObject(this);
          overwriteMetadata(this);
      }
      return Sleepstate;
  }());

  var Startdef = /** @class */ (function () {
      function Startdef(model) {
          Object.assign(this, model);
          overwriteScheduleIfObject(this);
      }
      return Startdef;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var StateExecTimeout = /** @class */ (function () {
      function StateExecTimeout(model) {
          Object.assign(this, model);
      }
      return StateExecTimeout;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Statedatafilter = /** @class */ (function () {
      function Statedatafilter(model) {
          Object.assign(this, model);
      }
      return Statedatafilter;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Subflowref = /** @class */ (function () {
      function Subflowref(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Subflowref} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Subflowref(_this);
              return clone;
          };
          Object.assign(this, model);
      }
      return Subflowref;
  }());

  var Timeouts = /** @class */ (function () {
      function Timeouts(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Exectimeout} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Timeouts(_this);
              normalizeWorkflowExecTimeout(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteWorkflowExecTimeout(this);
          overwriteStateExecTimeout(this);
      }
      return Timeouts;
  }());

  var Transition = /** @class */ (function () {
      function Transition(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Transition} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Transition(_this);
              normalizeCompensate(clone);
              return clone;
          };
          var defaultModel = {
              compensate: false,
          };
          Object.assign(this, defaultModel, model);
          overwriteProduceEvents(this);
      }
      return Transition;
  }());

  var Transitiondatacondition = /** @class */ (function () {
      function Transitiondatacondition(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Transitiondatacondition} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Transitiondatacondition(_this);
              normalizeTransitionIfObject(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteTransitionIfObject(this);
          overwriteMetadata(this);
      }
      return Transitiondatacondition;
  }());

  var Transitioneventcondition = /** @class */ (function () {
      function Transitioneventcondition(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.Transitioneventcondition} without deleted properties.
           */
          this.normalize = function () {
              var clone = new Transitioneventcondition(_this);
              normalizeTransitionIfObject(clone);
              return clone;
          };
          Object.assign(this, model);
          overwriteTransitionIfObject(this);
          overwriteEventDataFilter(this);
          overwriteMetadata(this);
      }
      return Transitioneventcondition;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var WorkflowExecTimeout = /** @class */ (function () {
      function WorkflowExecTimeout(model) {
          var _this = this;
          /**
           * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
           * @returns {Specification.WorkflowExecTimeout} without deleted properties.
           */
          this.normalize = function () {
              var clone = new WorkflowExecTimeout(_this);
              normalizeInterrupt(clone);
              return clone;
          };
          var defaultModel = { interrupt: true };
          Object.assign(this, defaultModel, model);
      }
      return WorkflowExecTimeout;
  }());

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var specification = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Workflow: Workflow,
    Action: Action,
    Actiondatafilter: Actiondatafilter,
    Authdef: Authdef,
    Basicpropsdef: Basicpropsdef,
    Bearerpropsdef: Bearerpropsdef,
    Branch: Branch,
    Callbackstate: Callbackstate,
    Continueasdef: Continueasdef,
    CorrelationDef: CorrelationDef,
    Crondef: Crondef,
    Databasedswitch: Databasedswitch,
    Defaultconditiondef: Defaultconditiondef,
    End: End,
    Enddatacondition: Enddatacondition,
    Enddeventcondition: Enddeventcondition,
    Error: Error$1,
    Errordef: Errordef,
    Eventbasedswitch: Eventbasedswitch,
    Eventdatafilter: Eventdatafilter,
    Eventdef: Eventdef,
    Eventref: Eventref,
    Eventstate: Eventstate,
    Foreachstate: Foreachstate,
    Function: Function$1,
    Functionref: Functionref,
    Injectstate: Injectstate,
    Metadata: Metadata,
    Oauth2propsdef: Oauth2propsdef,
    Onevents: Onevents,
    Operationstate: Operationstate,
    Parallelstate: Parallelstate,
    Produceeventdef: Produceeventdef,
    Retrydef: Retrydef,
    Schedule: Schedule,
    Sleep: Sleep,
    Sleepstate: Sleepstate,
    Startdef: Startdef,
    StateExecTimeout: StateExecTimeout,
    Statedatafilter: Statedatafilter,
    Subflowref: Subflowref,
    Timeouts: Timeouts,
    Transition: Transition,
    Transitiondatacondition: Transitiondatacondition,
    Transitioneventcondition: Transitioneventcondition,
    WorkflowExecTimeout: WorkflowExecTimeout
  });

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Workflow} data The underlying object
   * @returns {Specification.Workflow} The validated underlying object
   */
  function workflowBuildingFn(data) {
      return function () {
          var model = new Workflow(data);
          validate('Workflow', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Workflow`
   * @returns {Specification.Workflow} A builder for `Specification.Workflow`
   */
  function workflowBuilder() {
      return builder(workflowBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Action} data The underlying object
   * @returns {Specification.Action} The validated underlying object
   */
  function actionBuildingFn(data) {
      return function () {
          var model = new Action(data);
          validate('Action', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Action`
   * @returns {Specification.Action} A builder for `Specification.Action`
   */
  function actionBuilder() {
      return builder(actionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Actiondatafilter} data The underlying object
   * @returns {Specification.Actiondatafilter} The validated underlying object
   */
  function actiondatafilterBuildingFn(data) {
      return function () {
          var model = new Actiondatafilter(data);
          validate('Actiondatafilter', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Actiondatafilter`
   * @returns {Specification.Actiondatafilter} A builder for `Specification.Actiondatafilter`
   */
  function actiondatafilterBuilder() {
      return builder(actiondatafilterBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Authdef} data The underlying object
   * @returns {Specification.Authdef} The validated underlying object
   */
  function authdefBuildingFn(data) {
      return function () {
          var model = new Authdef(data);
          validate('Authdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Authdef`
   * @returns {Specification.Authdef} A builder for `Specification.Authdef`
   */
  function authdefBuilder() {
      return builder(authdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Basicpropsdef} data The underlying object
   * @returns {Specification.Basicpropsdef} The validated underlying object
   */
  function basicpropsdefBuildingFn(data) {
      return function () {
          var model = new Basicpropsdef(data);
          validate('Basicpropsdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Basicpropsdef`
   * @returns {Specification.Basicpropsdef} A builder for `Specification.Basicpropsdef`
   */
  function basicpropsdefBuilder() {
      return builder(basicpropsdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Bearerpropsdef} data The underlying object
   * @returns {Specification.Bearerpropsdef} The validated underlying object
   */
  function bearerpropsdefBuildingFn(data) {
      return function () {
          var model = new Bearerpropsdef(data);
          validate('Bearerpropsdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Bearerpropsdef`
   * @returns {Specification.Bearerpropsdef} A builder for `Specification.Bearerpropsdef`
   */
  function bearerpropsdefBuilder() {
      return builder(bearerpropsdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Branch} data The underlying object
   * @returns {Specification.Branch} The validated underlying object
   */
  function branchBuildingFn(data) {
      return function () {
          var model = new Branch(data);
          validate('Branch', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Branch`
   * @returns {Specification.Branch} A builder for `Specification.Branch`
   */
  function branchBuilder() {
      return builder(branchBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Callbackstate} data The underlying object
   * @returns {Specification.Callbackstate} The validated underlying object
   */
  function callbackstateBuildingFn(data) {
      return function () {
          var model = new Callbackstate(data);
          setEndValueIfNoTransition(model);
          validate('Callbackstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Callbackstate`
   * @returns {Specification.Callbackstate} A builder for `Specification.Callbackstate`
   */
  function callbackstateBuilder() {
      return builder(callbackstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Continueasdef} data The underlying object
   * @returns {Specification.Continueasdef} The validated underlying object
   */
  function continueasdefBuildingFn(data) {
      return function () {
          var model = new Continueasdef(data);
          validate('Continueasdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Continueasdef`
   * @returns {Specification.Continueasdef} A builder for `Specification.Continueasdef`
   */
  function continueasdefBuilder() {
      return builder(continueasdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.CorrelationDef} data The underlying object
   * @returns {Specification.CorrelationDef} The validated underlying object
   */
  function correlationDefBuildingFn(data) {
      return function () {
          var model = new CorrelationDef(data);
          validate('CorrelationDef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.CorrelationDef`
   * @returns {Specification.CorrelationDef} A builder for `Specification.CorrelationDef`
   */
  function correlationDefBuilder() {
      return builder(correlationDefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Crondef} data The underlying object
   * @returns {Specification.Crondef} The validated underlying object
   */
  function crondefBuildingFn(data) {
      return function () {
          var model = new Crondef(data);
          validate('Crondef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Crondef`
   * @returns {Specification.Crondef} A builder for `Specification.Crondef`
   */
  function crondefBuilder() {
      return builder(crondefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Databasedswitch} data The underlying object
   * @returns {Specification.Databasedswitch} The validated underlying object
   */
  function databasedswitchBuildingFn(data) {
      return function () {
          var model = new Databasedswitch(data);
          validate('Databasedswitch', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Databasedswitch`
   * @returns {Specification.Databasedswitch} A builder for `Specification.Databasedswitch`
   */
  function databasedswitchBuilder() {
      return builder(databasedswitchBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Defaultconditiondef} data The underlying object
   * @returns {Specification.Defaultconditiondef} The validated underlying object
   */
  function defaultconditiondefBuildingFn(data) {
      return function () {
          var model = new Defaultconditiondef(data);
          validate('Defaultconditiondef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Defaultconditiondef`
   * @returns {Specification.Defaultconditiondef} A builder for `Specification.Defaultconditiondef`
   */
  function defaultconditiondefBuilder() {
      return builder(defaultconditiondefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.End} data The underlying object
   * @returns {Specification.End} The validated underlying object
   */
  function endBuildingFn(data) {
      return function () {
          var model = new End(data);
          validate('End', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.End`
   * @returns {Specification.End} A builder for `Specification.End`
   */
  function endBuilder() {
      return builder(endBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Enddatacondition} data The underlying object
   * @returns {Specification.Enddatacondition} The validated underlying object
   */
  function enddataconditionBuildingFn(data) {
      return function () {
          var model = new Enddatacondition(data);
          validate('Enddatacondition', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Enddatacondition`
   * @returns {Specification.Enddatacondition} A builder for `Specification.Enddatacondition`
   */
  function enddataconditionBuilder() {
      return builder(enddataconditionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Enddeventcondition} data The underlying object
   * @returns {Specification.Enddeventcondition} The validated underlying object
   */
  function enddeventconditionBuildingFn(data) {
      return function () {
          var model = new Enddeventcondition(data);
          validate('Enddeventcondition', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Enddeventcondition`
   * @returns {Specification.Enddeventcondition} A builder for `Specification.Enddeventcondition`
   */
  function enddeventconditionBuilder() {
      return builder(enddeventconditionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Error} data The underlying object
   * @returns {Specification.Error} The validated underlying object
   */
  function errorBuildingFn(data) {
      return function () {
          var model = new Error$1(data);
          setEndValueIfNoTransition(model);
          validate('Error', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Error`
   * @returns {Specification.Error} A builder for `Specification.Error`
   */
  function errorBuilder() {
      return builder(errorBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Errordef} data The underlying object
   * @returns {Specification.Errordef} The validated underlying object
   */
  function errordefBuildingFn(data) {
      return function () {
          var model = new Errordef(data);
          validate('Errordef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Errordef`
   * @returns {Specification.Errordef} A builder for `Specification.Errordef`
   */
  function errordefBuilder() {
      return builder(errordefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Eventbasedswitch} data The underlying object
   * @returns {Specification.Eventbasedswitch} The validated underlying object
   */
  function eventbasedswitchBuildingFn(data) {
      return function () {
          var model = new Eventbasedswitch(data);
          validate('Eventbasedswitch', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Eventbasedswitch`
   * @returns {Specification.Eventbasedswitch} A builder for `Specification.Eventbasedswitch`
   */
  function eventbasedswitchBuilder() {
      return builder(eventbasedswitchBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Eventdatafilter} data The underlying object
   * @returns {Specification.Eventdatafilter} The validated underlying object
   */
  function eventdatafilterBuildingFn(data) {
      return function () {
          var model = new Eventdatafilter(data);
          validate('Eventdatafilter', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Eventdatafilter`
   * @returns {Specification.Eventdatafilter} A builder for `Specification.Eventdatafilter`
   */
  function eventdatafilterBuilder() {
      return builder(eventdatafilterBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Eventdef} data The underlying object
   * @returns {Specification.Eventdef} The validated underlying object
   */
  function eventdefBuildingFn(data) {
      return function () {
          var model = new Eventdef(data);
          validate('Eventdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Eventdef`
   * @returns {Specification.Eventdef} A builder for `Specification.Eventdef`
   */
  function eventdefBuilder() {
      return builder(eventdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Eventref} data The underlying object
   * @returns {Specification.Eventref} The validated underlying object
   */
  function eventrefBuildingFn(data) {
      return function () {
          var model = new Eventref(data);
          validate('Eventref', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Eventref`
   * @returns {Specification.Eventref} A builder for `Specification.Eventref`
   */
  function eventrefBuilder() {
      return builder(eventrefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Eventstate} data The underlying object
   * @returns {Specification.Eventstate} The validated underlying object
   */
  function eventstateBuildingFn(data) {
      return function () {
          var model = new Eventstate(data);
          setEndValueIfNoTransition(model);
          validate('Eventstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Eventstate`
   * @returns {Specification.Eventstate} A builder for `Specification.Eventstate`
   */
  function eventstateBuilder() {
      return builder(eventstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Foreachstate} data The underlying object
   * @returns {Specification.Foreachstate} The validated underlying object
   */
  function foreachstateBuildingFn(data) {
      return function () {
          var model = new Foreachstate(data);
          setEndValueIfNoTransition(model);
          validate('Foreachstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Foreachstate`
   * @returns {Specification.Foreachstate} A builder for `Specification.Foreachstate`
   */
  function foreachstateBuilder() {
      return builder(foreachstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Function} data The underlying object
   * @returns {Specification.Function} The validated underlying object
   */
  function functionBuildingFn(data) {
      return function () {
          var model = new Function$1(data);
          validate('Function', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Function`
   * @returns {Specification.Function} A builder for `Specification.Function`
   */
  function functionBuilder() {
      return builder(functionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Functionref} data The underlying object
   * @returns {Specification.Functionref} The validated underlying object
   */
  function functionrefBuildingFn(data) {
      return function () {
          var model = new Functionref(data);
          validate('Functionref', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Functionref`
   * @returns {Specification.Functionref} A builder for `Specification.Functionref`
   */
  function functionrefBuilder() {
      return builder(functionrefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Injectstate} data The underlying object
   * @returns {Specification.Injectstate} The validated underlying object
   */
  function injectstateBuildingFn(data) {
      return function () {
          var model = new Injectstate(data);
          setEndValueIfNoTransition(model);
          validate('Injectstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Injectstate`
   * @returns {Specification.Injectstate} A builder for `Specification.Injectstate`
   */
  function injectstateBuilder() {
      return builder(injectstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Metadata} data The underlying object
   * @returns {Specification.Metadata} The validated underlying object
   */
  function metadataBuildingFn(data) {
      return function () {
          var model = new Metadata(data);
          validate('Metadata', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Metadata`
   * @returns {Specification.Metadata} A builder for `Specification.Metadata`
   */
  function metadataBuilder() {
      return builder(metadataBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Oauth2propsdef} data The underlying object
   * @returns {Specification.Oauth2propsdef} The validated underlying object
   */
  function oauth2propsdefBuildingFn(data) {
      return function () {
          var model = new Oauth2propsdef(data);
          validate('Oauth2propsdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Oauth2propsdef`
   * @returns {Specification.Oauth2propsdef} A builder for `Specification.Oauth2propsdef`
   */
  function oauth2propsdefBuilder() {
      return builder(oauth2propsdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Onevents} data The underlying object
   * @returns {Specification.Onevents} The validated underlying object
   */
  function oneventsBuildingFn(data) {
      return function () {
          var model = new Onevents(data);
          validate('Onevents', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Onevents`
   * @returns {Specification.Onevents} A builder for `Specification.Onevents`
   */
  function oneventsBuilder() {
      return builder(oneventsBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Operationstate} data The underlying object
   * @returns {Specification.Operationstate} The validated underlying object
   */
  function operationstateBuildingFn(data) {
      return function () {
          var model = new Operationstate(data);
          setEndValueIfNoTransition(model);
          validate('Operationstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Operationstate`
   * @returns {Specification.Operationstate} A builder for `Specification.Operationstate`
   */
  function operationstateBuilder() {
      return builder(operationstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Parallelstate} data The underlying object
   * @returns {Specification.Parallelstate} The validated underlying object
   */
  function parallelstateBuildingFn(data) {
      return function () {
          var model = new Parallelstate(data);
          setEndValueIfNoTransition(model);
          validate('Parallelstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Parallelstate`
   * @returns {Specification.Parallelstate} A builder for `Specification.Parallelstate`
   */
  function parallelstateBuilder() {
      return builder(parallelstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Produceeventdef} data The underlying object
   * @returns {Specification.Produceeventdef} The validated underlying object
   */
  function produceeventdefBuildingFn(data) {
      return function () {
          var model = new Produceeventdef(data);
          validate('Produceeventdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Produceeventdef`
   * @returns {Specification.Produceeventdef} A builder for `Specification.Produceeventdef`
   */
  function produceeventdefBuilder() {
      return builder(produceeventdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Retrydef} data The underlying object
   * @returns {Specification.Retrydef} The validated underlying object
   */
  function retrydefBuildingFn(data) {
      return function () {
          var model = new Retrydef(data);
          validate('Retrydef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Retrydef`
   * @returns {Specification.Retrydef} A builder for `Specification.Retrydef`
   */
  function retrydefBuilder() {
      return builder(retrydefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Schedule} data The underlying object
   * @returns {Specification.Schedule} The validated underlying object
   */
  function scheduleBuildingFn(data) {
      return function () {
          var model = new Schedule(data);
          validate('Schedule', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Schedule`
   * @returns {Specification.Schedule} A builder for `Specification.Schedule`
   */
  function scheduleBuilder() {
      return builder(scheduleBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Sleep} data The underlying object
   * @returns {Specification.Sleep} The validated underlying object
   */
  function sleepBuildingFn(data) {
      return function () {
          var model = new Sleep(data);
          validate('Sleep', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Sleep`
   * @returns {Specification.Sleep} A builder for `Specification.Sleep`
   */
  function sleepBuilder() {
      return builder(sleepBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Sleepstate} data The underlying object
   * @returns {Specification.Sleepstate} The validated underlying object
   */
  function sleepstateBuildingFn(data) {
      return function () {
          var model = new Sleepstate(data);
          validate('Sleepstate', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Sleepstate`
   * @returns {Specification.Sleepstate} A builder for `Specification.Sleepstate`
   */
  function sleepstateBuilder() {
      return builder(sleepstateBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Startdef} data The underlying object
   * @returns {Specification.Startdef} The validated underlying object
   */
  function startdefBuildingFn(data) {
      return function () {
          var model = new Startdef(data);
          validate('Startdef', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Startdef`
   * @returns {Specification.Startdef} A builder for `Specification.Startdef`
   */
  function startdefBuilder() {
      return builder(startdefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.StateExecTimeout} data The underlying object
   * @returns {Specification.StateExecTimeout} The validated underlying object
   */
  function stateExecTimeoutBuildingFn(data) {
      return function () {
          var model = new StateExecTimeout(data);
          validate('StateExecTimeout', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.StateExecTimeout`
   * @returns {Specification.StateExecTimeout} A builder for `Specification.StateExecTimeout`
   */
  function stateExecTimeoutBuilder() {
      return builder(stateExecTimeoutBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Statedatafilter} data The underlying object
   * @returns {Specification.Statedatafilter} The validated underlying object
   */
  function statedatafilterBuildingFn(data) {
      return function () {
          var model = new Statedatafilter(data);
          validate('Statedatafilter', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Statedatafilter`
   * @returns {Specification.Statedatafilter} A builder for `Specification.Statedatafilter`
   */
  function statedatafilterBuilder() {
      return builder(statedatafilterBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Subflowref} data The underlying object
   * @returns {Specification.Subflowref} The validated underlying object
   */
  function subflowrefBuildingFn(data) {
      return function () {
          var model = new Subflowref(data);
          validate('Subflowref', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Subflowref`
   * @returns {Specification.Subflowref} A builder for `Specification.Subflowref`
   */
  function subflowrefBuilder() {
      return builder(subflowrefBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Timeouts} data The underlying object
   * @returns {Specification.Timeouts} The validated underlying object
   */
  function timeoutsBuildingFn(data) {
      return function () {
          var model = new Timeouts(data);
          validate('Timeouts', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Timeouts`
   * @returns {Specification.Timeouts} A builder for `Specification.Timeouts`
   */
  function timeoutsBuilder() {
      return builder(timeoutsBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Transition} data The underlying object
   * @returns {Specification.Transition} The validated underlying object
   */
  function transitionBuildingFn(data) {
      return function () {
          var model = new Transition(data);
          validate('Transition', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Transition`
   * @returns {Specification.Transition} A builder for `Specification.Transition`
   */
  function transitionBuilder() {
      return builder(transitionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Transitiondatacondition} data The underlying object
   * @returns {Specification.Transitiondatacondition} The validated underlying object
   */
  function transitiondataconditionBuildingFn(data) {
      return function () {
          var model = new Transitiondatacondition(data);
          validate('Transitiondatacondition', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Transitiondatacondition`
   * @returns {Specification.Transitiondatacondition} A builder for `Specification.Transitiondatacondition`
   */
  function transitiondataconditionBuilder() {
      return builder(transitiondataconditionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.Transitioneventcondition} data The underlying object
   * @returns {Specification.Transitioneventcondition} The validated underlying object
   */
  function transitioneventconditionBuildingFn(data) {
      return function () {
          var model = new Transitioneventcondition(data);
          validate('Transitioneventcondition', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.Transitioneventcondition`
   * @returns {Specification.Transitioneventcondition} A builder for `Specification.Transitioneventcondition`
   */
  function transitioneventconditionBuilder() {
      return builder(transitioneventconditionBuildingFn);
  }

  /*
   * Copyright 2021-Present The Serverless Workflow Specification Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The internal function used by the builder proxy to validate and return its underlying object
   * @param {Specification.WorkflowExecTimeout} data The underlying object
   * @returns {Specification.WorkflowExecTimeout} The validated underlying object
   */
  function workflowExecTimeoutBuildingFn(data) {
      return function () {
          var model = new WorkflowExecTimeout(data);
          validate('WorkflowExecTimeout', model);
          return model;
      };
  }
  /**
   * A factory to create a builder proxy for the type `Specification.WorkflowExecTimeout`
   * @returns {Specification.WorkflowExecTimeout} A builder for `Specification.WorkflowExecTimeout`
   */
  function workflowExecTimeoutBuilder() {
      return builder(workflowExecTimeoutBuildingFn);
  }

  var MermaidState = /** @class */ (function () {
      function MermaidState(state, isFirstState) {
          if (isFirstState === void 0) { isFirstState = false; }
          this.state = state;
          this.isFirstState = isFirstState;
      }
      MermaidState.prototype.sourceCode = function () {
          return this.definitions() + '\n' + this.transitions();
      };
      MermaidState.prototype.definitions = function () {
          return (this.definitionName() + '\n' + this.definitionType() + (this.definitionDetails() !== undefined ? '\n' + this.definitionDetails() : ''));
      };
      MermaidState.prototype.transitions = function () {
          var transitions = [];
          transitions.push.apply(transitions, this.startTransition());
          transitions.push.apply(transitions, this.dataConditionsTransitions());
          transitions.push.apply(transitions, this.eventConditionsTransition());
          transitions.push.apply(transitions, this.errorTransitions());
          transitions.push.apply(transitions, this.naturalTransition(this.stateName(), this.state.transition));
          transitions.push.apply(transitions, this.endTransition());
          return transitions.reduce(function (p, c) {
              return p + '\n' + c;
          });
      };
      MermaidState.prototype.stateName = function () {
          var _a;
          return (_a = this.state.name) === null || _a === void 0 ? void 0 : _a.replace(" ", "_");
      };
      MermaidState.prototype.startTransition = function () {
          var transitions = [];
          if (this.isFirstState) {
              var stateName = this.stateName();
              transitions.push(this.transitionDescription('[*]', stateName));
          }
          return transitions;
      };
      MermaidState.prototype.dataConditionsTransitions = function () {
          var _this = this;
          var transitions = [];
          var dataBasedSwitchState = this.state;
          if (dataBasedSwitchState.dataConditions) {
              var stateName_1 = this.stateName();
              dataBasedSwitchState.dataConditions.forEach(function (dataCondition) {
                  var transitionDataCondition = dataCondition;
                  transitions.push.apply(transitions, _this.naturalTransition(stateName_1, transitionDataCondition.transition, transitionDataCondition.condition));
                  var endDataCondition = dataCondition; //TODO
                  if (endDataCondition.end) {
                      transitions.push(_this.transitionDescription(stateName_1, endDataCondition.name, endDataCondition.condition));
                  }
              });
              transitions.push.apply(transitions, this.defaultConditionTransition(dataBasedSwitchState));
          }
          return transitions;
      };
      MermaidState.prototype.eventConditionsTransition = function () {
          var _this = this;
          var transitions = [];
          var eventBasedSwitchState = this.state;
          if (eventBasedSwitchState.eventConditions) {
              var stateName_2 = this.stateName();
              eventBasedSwitchState.eventConditions.forEach(function (eventCondition) {
                  var transitionEventCondition = eventCondition;
                  transitions.push.apply(transitions, _this.naturalTransition(stateName_2, transitionEventCondition.transition));
                  var endEventCondition = eventCondition;
                  if (endEventCondition.end) {
                      transitions.push(_this.transitionDescription(stateName_2, '[*]'));
                  }
              });
              transitions.push.apply(transitions, this.defaultConditionTransition(eventBasedSwitchState));
          }
          return transitions;
      };
      MermaidState.prototype.defaultConditionTransition = function (state) {
          var transitions = [];
          if (state.defaultCondition) {
              transitions.push.apply(transitions, this.naturalTransition(this.stateName(), state.defaultCondition.transition, 'default'));
          }
          return transitions;
      };
      MermaidState.prototype.endTransition = function () {
          var transitions = [];
          if (this.state.end) {
              var stateName = this.stateName();
              var transitionLabel = undefined;
              if (isObject(this.state.end)) {
                  var end = this.state.end;
                  if (end.produceEvents.length > 0) {
                      transitionLabel = 'Produced event = [' + end.produceEvents.map(function (pe) { return pe.eventRef; }).join(',') + ']';
                  }
              }
              transitions.push(this.transitionDescription(stateName, '[*]', transitionLabel));
          }
          return transitions;
      };
      MermaidState.prototype.naturalTransition = function (start, end, label) {
          if (label === void 0) { label = undefined; }
          var transitions = [];
          if (end) {
              var descTransition = '';
              if (isObject(end)) {
                  descTransition = end.nextState;
              }
              else if (typeof end === 'string') {
                  descTransition = end;
              }
              transitions.push(this.transitionDescription(start, descTransition, label ? label : undefined));
          }
          return transitions;
      };
      MermaidState.prototype.errorTransitions = function () {
          var _this = this;
          var transitions = [];
          if (this.state.onErrors) {
              this.state.onErrors.forEach(function (error) {
                  transitions.push.apply(transitions, _this.naturalTransition(_this.stateName(), error.transition, error.errorRef));
              });
          }
          return transitions;
      };
      MermaidState.prototype.definitionDetails = function () {
          switch (this.state.type) {
              case 'sleep':
                  return this.sleepStateDetails();
              case 'event':
                  return undefined; //NOTHING
              case 'operation':
                  return this.operationStateDetails();
              case 'parallel':
                  return this.parallelStateDetails();
              case 'switch':
                  var switchState = this.state;
                  if (switchState.dataConditions) {
                      return this.dataBasedSwitchStateDetails();
                  }
                  if (switchState.eventConditions) {
                      return this.eventBasedSwitchStateDetails();
                  }
                  throw new Error("Unexpected switch type; \n state value= " + JSON.stringify(this.state, null, 4));
              case 'inject':
                  return undefined; // NOTHING
              case 'foreach':
                  return this.foreachStateDetails();
              case 'callback':
                  return this.callbackStateDetails();
              default:
                  throw new Error("Unexpected type= " + this.state.type + "; \n state value= " + JSON.stringify(this.state, null, 4));
          }
      };
      MermaidState.prototype.definitionType = function () {
          var type = this.state.type;
          return this.stateDescription(this.stateName(), 'type', type.charAt(0).toUpperCase() + type.slice(1) + ' State');
      };
      MermaidState.prototype.parallelStateDetails = function () {
          var _a;
          var parallelState = this.state;
          var descriptions = [];
          if (parallelState.completionType) {
              descriptions.push(this.stateDescription(this.stateName(), 'Completion type', parallelState.completionType));
          }
          if (parallelState.branches) {
              descriptions.push(this.stateDescription(this.stateName(), 'Num. of branches', ((_a = parallelState.branches) === null || _a === void 0 ? void 0 : _a.length) + ''));
          }
          return descriptions.length > 0
              ? descriptions.reduce(function (p, c) {
                  return p + '\n' + c;
              })
              : undefined;
      };
      MermaidState.prototype.eventBasedSwitchStateDetails = function () {
          return this.stateDescription(this.stateName(), "Condition type", "event-based");
      };
      MermaidState.prototype.dataBasedSwitchStateDetails = function () {
          return this.stateDescription(this.stateName(), "Condition type", "data-based");
      };
      MermaidState.prototype.operationStateDetails = function () {
          var _a;
          var state = this.state;
          var descriptions = [];
          if (state.actionMode) {
              descriptions.push(this.stateDescription(this.stateName(), 'Action mode', state.actionMode));
          }
          if (state.actions) {
              descriptions.push(this.stateDescription(this.stateName(), 'Num. of actions', ((_a = state.actions) === null || _a === void 0 ? void 0 : _a.length) + ''));
          }
          return descriptions.length > 0
              ? descriptions.reduce(function (p, c) {
                  return p + '\n' + c;
              })
              : undefined;
      };
      MermaidState.prototype.sleepStateDetails = function () {
          var state = this.state;
          if (state.duration) {
              return this.stateDescription(this.stateName(), 'Duration', state.duration);
          }
          return undefined;
      };
      MermaidState.prototype.foreachStateDetails = function () {
          var _a;
          var state = this.state;
          var descriptions = [];
          if (state.inputCollection) {
              descriptions.push(this.stateDescription(this.stateName(), 'Input collection', state.inputCollection));
          }
          if (state.actions) {
              descriptions.push(this.stateDescription(this.stateName(), 'Num. of actions', ((_a = state.actions) === null || _a === void 0 ? void 0 : _a.length) + ''));
          }
          return descriptions.length > 0
              ? descriptions.reduce(function (p, c) {
                  return p + '\n' + c;
              })
              : undefined;
      };
      MermaidState.prototype.callbackStateDetails = function () {
          var state = this.state;
          var descriptions = [];
          if (state.action && state.action.functionRef) {
              var functionRef = state.action.functionRef;
              var functionRefDescription = '';
              if (isObject(functionRef)) {
                  functionRefDescription = functionRef.refName;
              }
              else if (typeof functionRef === 'string') {
                  functionRefDescription = functionRef;
              }
              descriptions.push(this.stateDescription(this.stateName(), 'Callback function', functionRefDescription));
          }
          if (state.eventRef) {
              descriptions.push(this.stateDescription(this.stateName(), 'Callback event', state.eventRef));
          }
          return descriptions.length > 0
              ? descriptions.reduce(function (p, c) {
                  return p + '\n' + c;
              })
              : undefined;
      };
      MermaidState.prototype.definitionName = function () {
          return this.stateName() + ' : ' + this.stateName();
      };
      MermaidState.prototype.transitionDescription = function (start, end, label) {
          if (label === void 0) { label = undefined; }
          return start + ' --> ' + end + (label ? ' : ' + label : '');
      };
      MermaidState.prototype.stateDescription = function (stateName, description, value) {
          return stateName + (" : " + description + " = " + value);
      };
      return MermaidState;
  }());

  var MermaidDiagram = /** @class */ (function () {
      function MermaidDiagram(workflow) {
          this.workflow = workflow;
      }
      MermaidDiagram.prototype.sourceCode = function () {
          var mermaidStateDiagramVersion = 'stateDiagram-v2';
          return (mermaidStateDiagramVersion +
              '\n' +
              this.workflow.states
                  .map(function (state, index) {
                  var isFirstState = index === 0;
                  return new MermaidState(state, isFirstState).sourceCode();
              })
                  .join('\n\n'));
      };
      return MermaidDiagram;
  }());

  exports.MermaidDiagram = MermaidDiagram;
  exports.Specification = specification;
  exports.ValidationError = ValidationError$1;
  exports.WorkflowValidator = WorkflowValidator;
  exports.actionBuilder = actionBuilder;
  exports.actiondatafilterBuilder = actiondatafilterBuilder;
  exports.authdefBuilder = authdefBuilder;
  exports.basicpropsdefBuilder = basicpropsdefBuilder;
  exports.bearerpropsdefBuilder = bearerpropsdefBuilder;
  exports.branchBuilder = branchBuilder;
  exports.callbackstateBuilder = callbackstateBuilder;
  exports.continueasdefBuilder = continueasdefBuilder;
  exports.correlationDefBuilder = correlationDefBuilder;
  exports.crondefBuilder = crondefBuilder;
  exports.databasedswitchBuilder = databasedswitchBuilder;
  exports.defaultconditiondefBuilder = defaultconditiondefBuilder;
  exports.endBuilder = endBuilder;
  exports.enddataconditionBuilder = enddataconditionBuilder;
  exports.enddeventconditionBuilder = enddeventconditionBuilder;
  exports.errorBuilder = errorBuilder;
  exports.errordefBuilder = errordefBuilder;
  exports.eventbasedswitchBuilder = eventbasedswitchBuilder;
  exports.eventdatafilterBuilder = eventdatafilterBuilder;
  exports.eventdefBuilder = eventdefBuilder;
  exports.eventrefBuilder = eventrefBuilder;
  exports.eventstateBuilder = eventstateBuilder;
  exports.foreachstateBuilder = foreachstateBuilder;
  exports.functionBuilder = functionBuilder;
  exports.functionrefBuilder = functionrefBuilder;
  exports.injectstateBuilder = injectstateBuilder;
  exports.metadataBuilder = metadataBuilder;
  exports.oauth2propsdefBuilder = oauth2propsdefBuilder;
  exports.oneventsBuilder = oneventsBuilder;
  exports.operationstateBuilder = operationstateBuilder;
  exports.parallelstateBuilder = parallelstateBuilder;
  exports.produceeventdefBuilder = produceeventdefBuilder;
  exports.retrydefBuilder = retrydefBuilder;
  exports.scheduleBuilder = scheduleBuilder;
  exports.sleepBuilder = sleepBuilder;
  exports.sleepstateBuilder = sleepstateBuilder;
  exports.startdefBuilder = startdefBuilder;
  exports.stateExecTimeoutBuilder = stateExecTimeoutBuilder;
  exports.statedatafilterBuilder = statedatafilterBuilder;
  exports.subflowrefBuilder = subflowrefBuilder;
  exports.timeoutsBuilder = timeoutsBuilder;
  exports.transitionBuilder = transitionBuilder;
  exports.transitiondataconditionBuilder = transitiondataconditionBuilder;
  exports.transitioneventconditionBuilder = transitioneventconditionBuilder;
  exports.validators = validators;
  exports.workflowBuilder = workflowBuilder;
  exports.workflowExecTimeoutBuilder = workflowExecTimeoutBuilder;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
