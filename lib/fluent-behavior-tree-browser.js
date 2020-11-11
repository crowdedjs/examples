(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fluentBehaviorTree = {}));
}(this, (function (exports) { 'use strict';

  /**
   * The return type when invoking behavior tree nodes.
   */
  var BehaviorTreeStatus;
  (function (BehaviorTreeStatus) {
      BehaviorTreeStatus["Success"] = "SUCCESS";
      BehaviorTreeStatus["Failure"] = "FAILURE";
      BehaviorTreeStatus["Running"] = "RUNNING";
  })(BehaviorTreeStatus || (BehaviorTreeStatus = {}));
  var BehaviorTreeStatus$1 = BehaviorTreeStatus;

  class BehaviorTreeError extends Error {
  }

  var Errors;
  (function (Errors) {
      Errors["NO_NODES"] = "Cannot create a behavior tree with zero nodes.";
      Errors["SPLICE_UNNESTED_TREE"] = "Cannot splice an unnested sub-tree. There must be a parent-tree.";
      Errors["INVERTER_NO_CHILDREN"] = "InverterNode must have a child node!";
      Errors["INVERTER_MULTIPLE_CHILDREN"] = "Can't add more than a single child to InverterNode!";
      Errors["UNNESTED_ACTION_NODE"] = "Can't create an unnested ActionNode. It must be a leaf node.";
      Errors["NO_RETURN_VALUE"] = "Node must return a BehaviorTreeStatus";
  })(Errors || (Errors = {}));
  var Errors$1 = Errors;

  var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  /**
   * A behavior tree leaf node for running an action
   *
   * @property {string}                                   name - The name of the node
   * @property {(state: StateData) => BehaviorTreeStatus} fn   - Function to invoke for the action.
   */
  class ActionNode {
      constructor(name, fn) {
          this.name = name;
          this.fn = fn;
      }
      tick(state) {
          return __awaiter(this, void 0, void 0, function* () {
              const result = yield this.fn(state);
              if (!result) {
                  throw new BehaviorTreeError(Errors$1.NO_RETURN_VALUE);
              }
              return result;
          });
      }
  }

  var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  /**
   * Decorator node that inverts the success/failure of its child.
   *
   * @property {string} name - The name of the node
   */
  class InverterNode {
      constructor(name) {
          this.name = name;
      }
      tick(state) {
          return __awaiter$1(this, void 0, void 0, function* () {
              if (!this.childNode) {
                  throw new BehaviorTreeError(Errors$1.INVERTER_NO_CHILDREN);
              }
              const result = yield this.childNode.tick(state);
              if (result === BehaviorTreeStatus$1.Failure) {
                  return BehaviorTreeStatus$1.Success;
              }
              else if (result === BehaviorTreeStatus$1.Success) {
                  return BehaviorTreeStatus$1.Failure;
              }
              return result;
          });
      }
      addChild(child) {
          if (!!this.childNode) {
              throw new BehaviorTreeError(Errors$1.INVERTER_MULTIPLE_CHILDREN);
          }
          this.childNode = child;
      }
  }

  var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  /**
   * Runs child's nodes in parallel.
   *
   * @property {string} name                 - The name of the node.
   * @property {number} requiredToFail    - Number of child failures required to terminate with failure.
   * @property {number} requiredToSucceed - Number of child successes required to terminate with success.
   */
  class ParallelNode {
      constructor(name, requiredToFail, requiredToSucceed) {
          this.name = name;
          this.requiredToFail = requiredToFail;
          this.requiredToSucceed = requiredToSucceed;
          /**
           * List of child nodes.
           *
           * @type {BehaviorTreeNodeInterface[]}
           */
          this.children = [];
      }
      tick(state) {
          return __awaiter$2(this, void 0, void 0, function* () {
              const statuses = yield Promise.all(this.children.map((c) => this.tickChildren(state, c)));
              const succeeded = statuses.filter((x) => x === BehaviorTreeStatus$1.Success).length;
              const failed = statuses.filter((x) => x === BehaviorTreeStatus$1.Failure).length;
              if (this.requiredToSucceed > 0 && succeeded >= this.requiredToSucceed) {
                  return BehaviorTreeStatus$1.Success;
              }
              if (this.requiredToFail > 0 && failed >= this.requiredToFail) {
                  return BehaviorTreeStatus$1.Failure;
              }
              return BehaviorTreeStatus$1.Running;
          });
      }
      addChild(child) {
          this.children.push(child);
      }
      tickChildren(state, child) {
          return __awaiter$2(this, void 0, void 0, function* () {
              try {
                  return yield child.tick(state);
              }
              catch (e) {
                  return BehaviorTreeStatus$1.Failure;
              }
          });
      }
  }

  class NodeEnumerator {
      constructor(nodes) {
          this.nodes = nodes;
          this.currentIndex = 0;
          this.nodes = nodes;
      }
      get current() {
          return this.nodes[this.currentIndex];
      }
      [Symbol.iterator]() {
          return {
              next: () => {
                  let result;
                  if (this.currentIndex < this.nodes.length) {
                      result = { value: this.current, done: false };
                      this.next();
                  }
                  else {
                      result = { done: true };
                  }
                  return result;
              },
          };
      }
      next() {
          if (this.hasNext()) {
              this.currentIndex++;
              return true;
          }
          return false;
      }
      hasNext() {
          return !!this.nodes[this.currentIndex + 1];
      }
      reset() {
          this.currentIndex = 0;
      }
  }

  var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  /**
   * Selects the first node that succeeds. Tries successive nodes until it finds one that doesn't fail.
   *
   * @property {string} name - The name of the node.
   */
  class SelectorNode {
      constructor(name, keepState = false) {
          this.name = name;
          this.keepState = keepState;
          /**
           * List of child nodes.
           *
           * @type {BehaviorTreeNodeInterface[]}
           */
          this.children = [];
      }
      init() {
          this.enumerator = new NodeEnumerator(this.children);
      }
      tick(state) {
          return __awaiter$3(this, void 0, void 0, function* () {
              if (!this.enumerator || !this.keepState) {
                  this.init();
              }
              if (!this.enumerator.current) {
                  return BehaviorTreeStatus$1.Running;
              }
              do {
                  const status = yield this.enumerator.current.tick(state);
                  if (status !== BehaviorTreeStatus$1.Failure) {
                      if (status === BehaviorTreeStatus$1.Success) {
                          this.enumerator.reset();
                      }
                      return status;
                  }
              } while (this.enumerator.next());
              this.enumerator.reset();
              return BehaviorTreeStatus$1.Failure;
          });
      }
      addChild(child) {
          this.children.push(child);
      }
  }

  var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  /**
   * Runs child nodes in sequence, until one fails.
   *
   * @property {string} name - The name of the node.
   */
  class SequenceNode {
      constructor(name, keepState = false) {
          this.name = name;
          this.keepState = keepState;
          /**
           * List of child nodes.
           *
           * @type {BehaviorTreeNodeInterface[]}
           */
          this.children = [];
      }
      init() {
          this.enumerator = new NodeEnumerator(this.children);
      }
      tick(state) {
          return __awaiter$4(this, void 0, void 0, function* () {
              if (!this.enumerator || !this.keepState) {
                  this.init();
              }
              if (!this.enumerator.current) {
                  return BehaviorTreeStatus$1.Running;
              }
              do {
                  const status = yield this.enumerator.current.tick(state);
                  if (status !== BehaviorTreeStatus$1.Success) {
                      if (status === BehaviorTreeStatus$1.Failure) {
                          this.enumerator.reset();
                      }
                      return status;
                  }
              } while (this.enumerator.next());
              this.enumerator.reset();
              return BehaviorTreeStatus$1.Success;
          });
      }
      addChild(child) {
          this.children.push(child);
      }
  }

  // From https://github.com/ts-data/stack/blob/master/stack.ts
  // See MIT license at https://github.com/ts-data/stack/blob/master/LICENSE
  class Node {
      constructor(data, previous) {
          this.previous = previous;
          this.data = data;
      }
  }

  // From https://github.com/ts-data/stack/blob/master/stack.ts
  class Stack {
      constructor() {
          this._topNode = undefined;
          this._count = 0;
      }
      count() {
          return this._count;
      }
      isEmpty() {
          return this._topNode === undefined;
      }
      push(value) {
          // create a new Node and add it to the top
          const node = new Node(value, this._topNode);
          this._topNode = node;
          this._count++;
      }
      pop() {
          // remove the top node from the stack.
          // the node at the top now is the one before it
          const poppedNode = this._topNode;
          this._topNode = poppedNode.previous;
          this._count--;
          return poppedNode.data;
      }
      peek() {
          return this._topNode.data;
      }
  }

  var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  class BehaviorTreeBuilder {
      constructor() {
          /**
           * Stack node nodes that we are build via the fluent API.
           *
           * @type {Stack<ParentBehaviorTreeNodeInterface>}
           */
          this.parentNodeStack = new Stack();
      }
      /**
       * Create an action node.
       *
       * @param {string} name
       * @param {(state: StateData) => BehaviorTreeStatus} fn
       * @returns {BehaviorTreeBuilder}
       */
      do(name, fn) {
          if (this.parentNodeStack.isEmpty()) {
              throw new BehaviorTreeError(Errors$1.UNNESTED_ACTION_NODE);
          }
          const actionNode = new ActionNode(name, fn);
          this.parentNodeStack.peek().addChild(actionNode);
          return this;
      }
      /**
       * Like an action node... but the function can return true/false and is mapped to success/failure.
       *
       * @param {string} name
       * @param {(state: StateData) => boolean} fn
       * @returns {BehaviorTreeBuilder}
       */
      condition(name, fn) {
          return this.do(name, (t) => __awaiter$5(this, void 0, void 0, function* () { return (yield fn(t)) ? BehaviorTreeStatus$1.Success : BehaviorTreeStatus$1.Failure; }));
      }
      /**
       * Create an inverter node that inverts the success/failure of its children.
       *
       * @param {string} name
       * @returns {BehaviorTreeBuilder}
       */
      inverter(name) {
          return this.addParentNode(new InverterNode(name));
      }
      /**
       * Create a sequence node.
       *
       * @param {string}  name
       * @param {boolean} keepState
       * @returns {BehaviorTreeBuilder}
       */
      sequence(name, keepState = true) {
          return this.addParentNode(new SequenceNode(name, keepState));
      }
      /**
       * Create a parallel node.
       *
       * @param {string} name
       * @param {number} requiredToFail
       * @param {number} requiredToSucceed
       * @returns {BehaviorTreeBuilder}
       */
      parallel(name, requiredToFail, requiredToSucceed) {
          return this.addParentNode(new ParallelNode(name, requiredToFail, requiredToSucceed));
      }
      /**
       * Create a selector node.
       *
       * @param {string}  name
       * @param {boolean} keepState
       * @returns {BehaviorTreeBuilder}
       */
      selector(name, keepState = true) {
          return this.addParentNode(new SelectorNode(name, keepState));
      }
      /**
       * Splice a sub tree into the parent tree.
       *
       * @param {BehaviorTreeNodeInterface} subTree
       * @returns {BehaviorTreeBuilder}
       */
      splice(subTree) {
          if (this.parentNodeStack.isEmpty()) {
              throw new BehaviorTreeError(Errors$1.SPLICE_UNNESTED_TREE);
          }
          this.parentNodeStack.peek().addChild(subTree);
          return this;
      }
      /**
       * Build the actual tree
       * @returns {BehaviorTreeNodeInterface}
       */
      build() {
          if (!this.curNode) {
              throw new BehaviorTreeError(Errors$1.NO_NODES);
          }
          return this.curNode;
      }
      /**
       * Ends a sequence of children.
       *
       * @returns {BehaviorTreeBuilder}
       */
      end() {
          this.curNode = this.parentNodeStack.pop();
          return this;
      }
      /**
       * Adds the parent node to the parentNodeStack
       *
       * @param {ParentBehaviorTreeNodeInterface} node
       * @returns {BehaviorTreeBuilder}
       */
      addParentNode(node) {
          if (!this.parentNodeStack.isEmpty()) {
              this.parentNodeStack.peek().addChild(node);
          }
          this.parentNodeStack.push(node);
          return this;
      }
  }

  /**
   * Represents time and state. Used to pass time values to behavior tree nodes.
   *
   * @property {number} deltaTime - The current time of this state representation
   * @property {object} state     - Any state data you would like to pass to the nodes.
   */
  class StateData {
      constructor(deltaTime = 0, state = {}) {
          this.deltaTime = deltaTime;
          this.state = state;
      }
  }

  exports.ActionNode = ActionNode;
  exports.BehaviorTreeBuilder = BehaviorTreeBuilder;
  exports.BehaviorTreeErorr = BehaviorTreeError;
  exports.BehaviorTreeStatus = BehaviorTreeStatus$1;
  exports.Errors = Errors$1;
  exports.InverterNode = InverterNode;
  exports.ParallelNode = ParallelNode;
  exports.SelectorNode = SelectorNode;
  exports.SequenceNode = SequenceNode;
  exports.StateData = StateData;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
