// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("src/util/reasonToMessage", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function reasonToMessage(reason) {
        if (reason instanceof Error) {
            return reason.message;
        }
        if (typeof reason === "string") {
            return reason;
        }
        if (reason === undefined || reason === null) {
            return "Unknown Error";
        }
        return reason.toString();
    }
    exports_1("reasonToMessage", reasonToMessage);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/core/of", ["src/util/reasonToMessage"], function (exports_2, context_2) {
    "use strict";
    var reasonToMessage_ts_1;
    var __moduleName = context_2 && context_2.id;
    /**
     * @name of
     * @param {Promise} promise
     * @returns {Promise<[*, undefined] | [undefined, *]>}
     */
    function of(promise) {
        return Promise
            .resolve(promise)
            .then((result) => {
            return [
                result,
                undefined,
            ];
        })
            .catch((reason) => {
            if (!(reason instanceof Error)) {
                reason = new Error(reasonToMessage_ts_1.reasonToMessage(reason));
            }
            return [
                undefined,
                reason,
            ];
        });
    }
    exports_2("of", of);
    return {
        setters: [
            function (reasonToMessage_ts_1_1) {
                reasonToMessage_ts_1 = reasonToMessage_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/interface/generator", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/type/errorOrString", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/type/errorOrVoid", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/const/type", [], function (exports_6, context_6) {
    "use strict";
    var FUNCTION, FUNCTION_ASYNC, FUNCTION_GENERATOR, OBJECT_GENERATOR, PROMISE;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            /**
             * @type {string}
             */
            exports_6("FUNCTION", FUNCTION = "Function");
            /**
             * @type {string}
             */
            exports_6("FUNCTION_ASYNC", FUNCTION_ASYNC = "AsyncFunction");
            /**
             * @type {string}
             */
            exports_6("FUNCTION_GENERATOR", FUNCTION_GENERATOR = "GeneratorFunction");
            /**
             * @type {string}
             */
            exports_6("OBJECT_GENERATOR", OBJECT_GENERATOR = "[object Generator]");
            /**
             * @type {string}
             */
            exports_6("PROMISE", PROMISE = "Promise");
        }
    };
});
System.register("src/core/ofAny", ["src/const/type", "src/util/reasonToMessage"], function (exports_7, context_7) {
    "use strict";
    var type_ts_1, reasonToMessage_ts_2;
    var __moduleName = context_7 && context_7.id;
    /**
     * @name ofAny
     * @param {Function|Promise} callable
     * @param {[]=} args
     * @param {*=} defaultResult
     * @param {*=} overrideError
     * @returns {Promise<[*, undefined] | [undefined, *]>}
     */
    function ofAny(callable, args, defaultResult, overrideError) {
        let call;
        switch (callable.constructor.name || Object.prototype.toString.call(callable)) {
            case type_ts_1.PROMISE:
                call = callable;
                break;
            case type_ts_1.FUNCTION_ASYNC:
                call = callable(...(Array.isArray(args) ? [...args] : []));
                break;
            case type_ts_1.FUNCTION:
                call = new Promise((resolve, reject) => {
                    try {
                        resolve(callable(...(Array.isArray(args) ? [...args] : [])));
                    }
                    catch (caughtFunctionError) {
                        reject(caughtFunctionError);
                    }
                });
                break;
            case type_ts_1.FUNCTION_GENERATOR:
                call = new Promise((resolve, reject) => {
                    const gen = callable(...(Array.isArray(args) ? [...args] : []));
                    try {
                        resolve(gen.next().value);
                    }
                    catch (caughtGeneratorFunctionError) {
                        reject(caughtGeneratorFunctionError);
                    }
                });
                break;
            case type_ts_1.OBJECT_GENERATOR:
                call = new Promise((resolve, reject) => {
                    try {
                        resolve(callable.next().value);
                    }
                    catch (caughtGeneratorError) {
                        reject(caughtGeneratorError);
                    }
                });
                break;
            default:
                call = new Promise((resolve, reject) => {
                    Promise
                        .resolve(callable)
                        .then(resolve)
                        .catch(reject);
                });
        }
        return Promise
            .resolve(call)
            .then((result) => {
            return [result, undefined];
        })
            .catch((reason) => {
            if (!(reason instanceof Error)) {
                reason = new Error(reasonToMessage_ts_2.reasonToMessage(reason));
            }
            if (overrideError instanceof Error) {
                reason = overrideError;
            }
            else if (typeof overrideError === "string") {
                reason.message = overrideError;
            }
            return [
                defaultResult,
                reason,
            ];
        });
    }
    exports_7("ofAny", ofAny);
    return {
        setters: [
            function (type_ts_1_1) {
                type_ts_1 = type_ts_1_1;
            },
            function (reasonToMessage_ts_2_1) {
                reasonToMessage_ts_2 = reasonToMessage_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/interface/config", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/core/ofAnyCase", ["src/const/type", "src/util/reasonToMessage"], function (exports_9, context_9) {
    "use strict";
    var type_ts_2, reasonToMessage_ts_3;
    var __moduleName = context_9 && context_9.id;
    /**
     * @name ofAnyCase
     * @param {Function|Promise} callable
     * @param {*=} config
     * @returns {Promise<[*, undefined] | [undefined, *]>}
     */
    function ofAnyCase(callable, config) {
        let theConfig = {};
        const { args, defaults, error, timeout } = new Object(config);
        Object.assign(theConfig, { args, defaults, error, timeout });
        let call;
        switch (callable.constructor.name ||
            Object.prototype.toString.call(callable)) {
            case type_ts_2.PROMISE:
                call = callable;
                theConfig.retries = 0;
                delete theConfig.args;
                break;
            case type_ts_2.FUNCTION_ASYNC:
                call = callable(...(Array.isArray(theConfig.args) ? [...theConfig.args] : []));
                break;
            case type_ts_2.FUNCTION:
                call = new Promise((resolve, reject) => {
                    try {
                        resolve(callable(...(Array.isArray(theConfig.args) ? [...theConfig.args] : [])));
                    }
                    catch (caughtFunctionError) {
                        reject(caughtFunctionError);
                    }
                });
                break;
            case type_ts_2.FUNCTION_GENERATOR:
                call = new Promise((resolve, reject) => {
                    const gen = callable(...(Array.isArray(theConfig.args) ? [...theConfig.args] : []));
                    try {
                        resolve(gen.next().value);
                    }
                    catch (caughtGeneratorFunctionError) {
                        reject(caughtGeneratorFunctionError);
                    }
                });
                break;
            case type_ts_2.OBJECT_GENERATOR:
                call = new Promise((resolve, reject) => {
                    try {
                        resolve(callable.next().value);
                    }
                    catch (caughtGeneratorError) {
                        reject(caughtGeneratorError);
                    }
                });
                delete theConfig.args;
                break;
            default:
                call = new Promise((resolve, reject) => {
                    Promise.resolve(callable)
                        .then(resolve)
                        .catch(reject);
                });
                delete theConfig.args;
        }
        // noinspection DuplicatedCode
        if (theConfig.timeout !== undefined) {
            const timeout = Number.parseInt(`${theConfig.timeout}`);
            if (Number.isFinite(timeout) && timeout > 0) {
                theConfig.timeout = timeout > Number.MAX_SAFE_INTEGER
                    ? Number.MAX_SAFE_INTEGER
                    : timeout;
            }
            else {
                delete theConfig.timeout;
            }
        }
        else {
            delete theConfig.timeout;
        }
        // noinspection DuplicatedCode
        return ((theConfig.timeout
            ? Promise.race([
                Promise.resolve(call),
                new Promise((_resolve, reject) => {
                    setTimeout(() => reject(new Error(`Timeout: ${theConfig.timeout}ms`)), theConfig.timeout);
                }),
            ])
            : Promise.resolve(call))
            .then((result) => {
            return [result, undefined];
        })
            // @ts-ignore
            .catch((reason) => {
            if (theConfig.retries !== undefined) {
                const retries = Number.parseInt(`${theConfig.retries}`, 10);
                if (Number.isFinite(retries) && retries > 0) {
                    theConfig.retries = retries > Number.MAX_SAFE_INTEGER
                        ? Number.MAX_SAFE_INTEGER
                        : retries;
                }
                else {
                    delete theConfig.retries;
                }
            }
            else {
                delete theConfig.retries;
            }
            if (theConfig.retries) {
                theConfig.attempt = theConfig.attempt === undefined
                    ? 0
                    : theConfig.attempt + 1;
                if (theConfig.attempt < theConfig.retries) {
                    // @ts-ignore
                    return ofAnyCase(callable, config);
                }
            }
            if (!(reason instanceof Error)) {
                reason = new Error(reasonToMessage_ts_3.reasonToMessage(reason));
            }
            if ("error" in theConfig && theConfig.error instanceof Error) {
                reason = theConfig.error;
            }
            else if (typeof theConfig.error === "string") {
                reason.message = theConfig.error;
            }
            return [theConfig.defaults, reason];
        }));
    }
    exports_9("ofAnyCase", ofAnyCase);
    return {
        setters: [
            function (type_ts_2_1) {
                type_ts_2 = type_ts_2_1;
            },
            function (reasonToMessage_ts_3_1) {
                reasonToMessage_ts_3 = reasonToMessage_ts_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/core/ofCase", ["src/util/reasonToMessage"], function (exports_10, context_10) {
    "use strict";
    var reasonToMessage_ts_4;
    var __moduleName = context_10 && context_10.id;
    /**
     * @name ofCase
     * @param {Promise} promise
     * @param {*=} config
     * @returns {Promise<[*, undefined] | [undefined, *]>}
     */
    function ofCase(promise, config) {
        let theConfig = {};
        const { args, defaults, error, timeout } = new Object(config);
        Object.assign(theConfig, { args, defaults, error, timeout });
        // noinspection DuplicatedCode
        if (theConfig.timeout !== undefined) {
            const timeout = Number.parseInt(`${theConfig.timeout}`);
            if (Number.isFinite(timeout) && timeout > 0) {
                theConfig.timeout = timeout > Number.MAX_SAFE_INTEGER
                    ? Number.MAX_SAFE_INTEGER
                    : timeout;
            }
            else {
                delete theConfig.timeout;
            }
        }
        else {
            delete theConfig.timeout;
        }
        // noinspection DuplicatedCode
        return (theConfig.timeout
            ? Promise.race([
                Promise.resolve(promise),
                new Promise((_resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error(`Timeout: ${theConfig.timeout}ms`));
                    }, theConfig.timeout);
                }),
            ])
            : Promise.resolve(promise))
            .then((result) => {
            return [result, undefined];
        })
            .catch((reason) => {
            if (!(reason instanceof Error)) {
                reason = new Error(reasonToMessage_ts_4.reasonToMessage(reason));
            }
            if ("error" in theConfig && theConfig.error instanceof Error) {
                reason = theConfig.error;
            }
            else if (typeof theConfig.error === "string") {
                reason.message = theConfig.error;
            }
            return [theConfig.defaults, reason];
        });
    }
    exports_10("ofCase", ofCase);
    return {
        setters: [
            function (reasonToMessage_ts_4_1) {
                reasonToMessage_ts_4 = reasonToMessage_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/core/ofError", ["src/util/reasonToMessage"], function (exports_11, context_11) {
    "use strict";
    var reasonToMessage_ts_5;
    var __moduleName = context_11 && context_11.id;
    /**
     * @name ofError
     * @param {Promise} promise
     * @param {*=} overrideError
     * @returns {Promise<*>}
     */
    function ofError(promise, overrideError) {
        return Promise
            .resolve(promise)
            .then(() => {
            return undefined;
        })
            .catch((reason) => {
            if (!(reason instanceof Error)) {
                reason = new Error(reasonToMessage_ts_5.reasonToMessage(reason));
            }
            if (overrideError instanceof Error) {
                reason = overrideError;
            }
            else if (typeof overrideError === "string") {
                reason.message = overrideError;
            }
            return reason;
        });
    }
    exports_11("ofError", ofError);
    return {
        setters: [
            function (reasonToMessage_ts_5_1) {
                reasonToMessage_ts_5 = reasonToMessage_ts_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/core/ofIt", ["src/util/reasonToMessage"], function (exports_12, context_12) {
    "use strict";
    var reasonToMessage_ts_6;
    var __moduleName = context_12 && context_12.id;
    /**
     * @name ofIt
     * @param {Promise} promise
     * @param {*=} defaultResult
     * @param {*=} overrideError
     * @returns {Promise<[*, undefined] | [undefined, *]>}
     */
    function ofIt(promise, defaultResult, overrideError) {
        return Promise
            .resolve(promise)
            .then((result) => {
            return [
                result,
                undefined,
            ];
        })
            .catch((reason) => {
            if (!(reason instanceof Error)) {
                reason = new Error(reasonToMessage_ts_6.reasonToMessage(reason));
            }
            if (overrideError instanceof Error) {
                reason = overrideError;
            }
            else if (typeof overrideError === "string") {
                reason.message = overrideError;
            }
            return [
                defaultResult,
                reason,
            ];
        });
    }
    exports_12("ofIt", ofIt);
    return {
        setters: [
            function (reasonToMessage_ts_6_1) {
                reasonToMessage_ts_6 = reasonToMessage_ts_6_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/core/ofOutcome", ["src/core/ofAnyCase"], function (exports_13, context_13) {
    "use strict";
    var ofAnyCase_ts_1;
    var __moduleName = context_13 && context_13.id;
    /**
     * @name ofOutcome
     * @description Returns result or thrown error wherever happens
     * @param {Function|Promise} callable
     * @param {*=} config
     * @returns {Promise<*>}
     */
    function ofOutcome(callable, config) {
        return new Promise((resolve) => {
            return ofAnyCase_ts_1.ofAnyCase(callable, config).then(([result, error]) => {
                if (error) {
                    resolve(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    exports_13("ofOutcome", ofOutcome);
    return {
        setters: [
            function (ofAnyCase_ts_1_1) {
                ofAnyCase_ts_1 = ofAnyCase_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/core/ofResult", [], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    /**
     * @name ofResult
     * @param {Promise} promise
     * @param {*=} defaultResult
     * @returns {Promise<*>}
     */
    function ofResult(promise, defaultResult) {
        return Promise
            .resolve(promise)
            .then((result) => {
            return result;
        })
            .catch(() => {
            return defaultResult;
        });
    }
    exports_14("ofResult", ofResult);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/util/isFunction", [], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    /**
     * @param {*} value
     * @returns {boolean}
     */
    function isFunction(value) {
        if (Object.prototype.toString.call(value) !== "[object Function]") {
            return false;
        }
        return !/^class\s/.test(Function.prototype.toString.call(value));
    }
    exports_15("isFunction", isFunction);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/core/ofSync", ["src/util/isFunction"], function (exports_16, context_16) {
    "use strict";
    var isFunction_ts_1;
    var __moduleName = context_16 && context_16.id;
    /**
     * @name ofSync
     * @param {Function} callable
     * @param {[]=} args
     * @param {*=} defaultResult
     * @param {*=} overrideError
     * @returns {[*, undefined] | [undefined, *]}
     */
    function ofSync(callable, args, defaultResult, overrideError) {
        if (!isFunction_ts_1.isFunction(callable)) {
            return [
                undefined,
                new Error("Unknown Error"),
            ];
        }
        try {
            return [
                callable(...(Array.isArray(args) ? [...args] : [])),
                undefined,
            ];
        }
        catch (error) {
            let caughtError;
            if (overrideError instanceof Error) {
                caughtError = overrideError;
            }
            else if (typeof overrideError === "string") {
                error.message = overrideError;
                caughtError = error;
            }
            else if (error === undefined || error === null) {
                caughtError = new Error("Unknown Error");
            }
            else {
                caughtError = new Error(error);
            }
            return [
                defaultResult,
                caughtError,
            ];
        }
    }
    exports_16("ofSync", ofSync);
    return {
        setters: [
            function (isFunction_ts_1_1) {
                isFunction_ts_1 = isFunction_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/Of", ["src/core/of", "src/core/ofAny", "src/core/ofAnyCase", "src/core/ofCase", "src/core/ofError", "src/core/ofIt", "src/core/ofOutcome", "src/core/ofResult", "src/core/ofSync"], function (exports_17, context_17) {
    "use strict";
    var of_ts_1, ofAny_ts_1, ofAnyCase_ts_2, ofCase_ts_1, ofError_ts_1, ofIt_ts_1, ofOutcome_ts_1, ofResult_ts_1, ofSync_ts_1, Of;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (of_ts_1_1) {
                of_ts_1 = of_ts_1_1;
            },
            function (ofAny_ts_1_1) {
                ofAny_ts_1 = ofAny_ts_1_1;
            },
            function (ofAnyCase_ts_2_1) {
                ofAnyCase_ts_2 = ofAnyCase_ts_2_1;
            },
            function (ofCase_ts_1_1) {
                ofCase_ts_1 = ofCase_ts_1_1;
            },
            function (ofError_ts_1_1) {
                ofError_ts_1 = ofError_ts_1_1;
            },
            function (ofIt_ts_1_1) {
                ofIt_ts_1 = ofIt_ts_1_1;
            },
            function (ofOutcome_ts_1_1) {
                ofOutcome_ts_1 = ofOutcome_ts_1_1;
            },
            function (ofResult_ts_1_1) {
                ofResult_ts_1 = ofResult_ts_1_1;
            },
            function (ofSync_ts_1_1) {
                ofSync_ts_1 = ofSync_ts_1_1;
            }
        ],
        execute: function () {
            Of = /** @class */ (() => {
                class Of {
                }
                /**
                 * @name any
                 * @alias ofAny
                 * @public
                 * @static
                 * @method
                 * @param {Function|Promise} callable
                 * @param {[]=} args
                 * @param {*=} defaultResult
                 * @param {*=} overrideError
                 * @returns {Promise<[*, undefined] | [undefined, *]>}
                 */
                Of.any = ofAny_ts_1.ofAny;
                /**
                 * @name anyCase
                 * @alias ofAnyCase
                 * @public
                 * @static
                 * @method
                 * @param {Function|Promise} callable
                 * @param {*=} config
                 * @returns {Promise<[*, undefined] | [undefined, *]>}
                 */
                Of.anyCase = ofAnyCase_ts_2.ofAnyCase;
                /**
                 * @name case
                 * @alias ofCase
                 * @public
                 * @static
                 * @method
                 * @param {Promise} promise
                 * @param {*=} config
                 * @returns {Promise<[*, undefined] | [undefined, *]>}
                 */
                Of.case = ofCase_ts_1.ofCase;
                /**
                 * @name error
                 * @alias ofError
                 * @public
                 * @static
                 * @method
                 * @param {Promise} promise
                 * @param {*=} overrideError
                 * @returns {Promise<*>}
                 */
                Of.error = ofError_ts_1.ofError;
                /**
                 * @name it
                 * @alias ofIt
                 * @public
                 * @static
                 * @method
                 * @param {Promise} promise
                 * @param {*=} defaultResult
                 * @param {*=} overrideError
                 * @returns {Promise<[*, undefined] | [undefined, *]>}
                 */
                Of.it = ofIt_ts_1.ofIt;
                /**
                 * @name async
                 * @alias of
                 * @public
                 * @static
                 * @method
                 * @param {Promise} promise
                 * @returns {Promise<[*, undefined] | [undefined, *]>}
                 */
                Of.async = of_ts_1.of;
                /**
                 * @name result
                 * @alias ofResult
                 * @public
                 * @static
                 * @method
                 * @param {Promise} promise
                 * @param {*=} defaultResult
                 * @returns {Promise<*>}
                 */
                Of.result = ofResult_ts_1.ofResult;
                /**
                 * @name sync
                 * @alias ofSync
                 * @public
                 * @static
                 * @method
                 * @param {Function} callable
                 * @param {[]=} args
                 * @param {*=} defaultResult
                 * @param {*=} overrideError
                 * @returns {[*, undefined] | [undefined, *]}
                 */
                Of.sync = ofSync_ts_1.ofSync;
                /**
                 * @name outcome
                 * @alias ofOutcome
                 * @public
                 * @static
                 * @method
                 * @param {Function|Promise} callable
                 * @param {*=} config
                 * @returns {Promise<[*, undefined] | [undefined, *]>}
                 */
                Of.outcome = ofOutcome_ts_1.ofOutcome;
                return Of;
            })();
            exports_17("Of", Of);
        }
    };
});
System.register("mod", ["src/core/of", "src/core/ofAny", "src/core/ofAnyCase", "src/core/ofCase", "src/core/ofError", "src/core/ofIt", "src/core/ofOutcome", "src/core/ofResult", "src/core/ofSync", "src/Of"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (of_ts_2_1) {
                exports_18({
                    "of": of_ts_2_1["of"]
                });
            },
            function (ofAny_ts_2_1) {
                exports_18({
                    "ofAny": ofAny_ts_2_1["ofAny"]
                });
            },
            function (ofAnyCase_ts_3_1) {
                exports_18({
                    "ofAnyCase": ofAnyCase_ts_3_1["ofAnyCase"]
                });
            },
            function (ofCase_ts_2_1) {
                exports_18({
                    "ofCase": ofCase_ts_2_1["ofCase"]
                });
            },
            function (ofError_ts_2_1) {
                exports_18({
                    "ofError": ofError_ts_2_1["ofError"]
                });
            },
            function (ofIt_ts_2_1) {
                exports_18({
                    "ofIt": ofIt_ts_2_1["ofIt"]
                });
            },
            function (ofOutcome_ts_2_1) {
                exports_18({
                    "ofOutcome": ofOutcome_ts_2_1["ofOutcome"]
                });
            },
            function (ofResult_ts_2_1) {
                exports_18({
                    "ofResult": ofResult_ts_2_1["ofResult"]
                });
            },
            function (ofSync_ts_2_1) {
                exports_18({
                    "ofSync": ofSync_ts_2_1["ofSync"]
                });
            },
            function (Of_ts_1_1) {
                exports_18({
                    "Of": Of_ts_1_1["Of"]
                });
            }
        ],
        execute: function () {
        }
    };
});

const __exp = __instantiate("mod", false);
export const of = __exp["of"];
export const ofAny = __exp["ofAny"];
export const ofAnyCase = __exp["ofAnyCase"];
export const ofCase = __exp["ofCase"];
export const ofError = __exp["ofError"];
export const ofIt = __exp["ofIt"];
export const ofOutcome = __exp["ofOutcome"];
export const ofResult = __exp["ofResult"];
export const ofSync = __exp["ofSync"];
export const Of = __exp["Of"];
