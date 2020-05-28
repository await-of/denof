import { TErrorOrString } from "../type/errorOrString.ts";
import { TErrorOrVoid } from "../type/errorOrVoid.ts";

import { isFunction } from "../util/isFunction.ts";

/**
 * @name ofSync
 * @param {Function} callable
 * @param {[]=} args
 * @param {*=} defaultResult
 * @param {*=} overrideError
 * @returns {[*, undefined] | [undefined, *]}
 */
export function ofSync<
  GAnyDefault extends unknown,
  GAnyResult extends unknown,
  GFunction extends (...args: any[]) => GAnyResult,
>(
  callable: GFunction,
  args?: any[],
  defaultResult?: GAnyDefault,
  overrideError?: TErrorOrString,
): [GAnyResult | GAnyDefault, TErrorOrVoid] {
  if (!isFunction(callable)) {
    return <[GAnyDefault, Error]> [
      undefined,
      new Error("Unknown Error"),
    ];
  }
  try {
    return <[GAnyResult, undefined]> [
      callable(...(Array.isArray(args) ? [...args] : [])),
      undefined,
    ];
  } catch (error) {
    let caughtError;
    if (overrideError instanceof Error) {
      caughtError = overrideError;
    } else if (typeof overrideError === "string") {
      error.message = overrideError;
      caughtError = error;
    } else if (error === undefined || error === null) {
      caughtError = new Error("Unknown Error");
    } else {
      caughtError = new Error(error);
    }
    return <[GAnyDefault, Error]> [
      defaultResult,
      caughtError,
    ];
  }
}
