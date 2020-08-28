import { IConfig } from "../interface/config.ts";

import { TErrorOrVoid } from "../type/errorOrVoid.ts";

import { reasonToMessage } from "../util/reasonToMessage.ts";

/**
 * @name ofCase
 * @param {Promise} promise
 * @param {*=} config
 * @returns {Promise<[*, undefined] | [undefined, *]>}
 */
export function ofCase<
  GAnyResult extends unknown,
  GAnyDefault extends unknown,
  GPromise extends Promise<GAnyResult>,
  GOptions extends IConfig<GAnyDefault>,
>(
  promise: GPromise,
  config?: GOptions,
): Promise<[GAnyResult | GAnyDefault, TErrorOrVoid]> {
  let theConfig: IConfig<GAnyDefault> = {};
  const { args, defaults, error, timeout } = new Object(config) as GOptions;
  Object.assign(theConfig, { args, defaults, error, timeout });
  // noinspection DuplicatedCode
  if (theConfig.timeout !== undefined) {
    const timeout = Number.parseInt(`${theConfig.timeout}`);
    if (Number.isFinite(timeout) && timeout > 0) {
      theConfig.timeout = timeout > Number.MAX_SAFE_INTEGER
        ? Number.MAX_SAFE_INTEGER
        : timeout;
    } else {
      delete theConfig.timeout;
    }
  } else {
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
    .then<[GAnyResult, undefined]>((result) => {
      return [result, undefined] as [GAnyResult, undefined];
    })
    .catch<[GAnyDefault, Error]>((reason: any) => {
      if (!(reason instanceof Error)) {
        reason = new Error(reasonToMessage(reason));
      }
      if ("error" in theConfig && theConfig.error instanceof Error) {
        reason = theConfig.error;
      } else if (typeof theConfig.error === "string") {
        reason.message = theConfig.error;
      }
      return [theConfig.defaults, reason] as [GAnyDefault, Error];
    });
}
