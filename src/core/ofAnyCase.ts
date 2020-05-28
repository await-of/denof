import { IConfig } from "../interface/config.ts";
import { IGenerator } from "../interface/generator.ts";

import { TErrorOrVoid } from "../type/errorOrVoid.ts";

import {
  FUNCTION,
  FUNCTION_ASYNC,
  FUNCTION_GENERATOR,
  OBJECT_GENERATOR,
  PROMISE,
} from "../const/type.ts";

import { reasonToMessage } from "../util/reasonToMessage.ts";

/**
 * @name ofAnyCase
 * @param {Function|Promise} callable
 * @param {*=} config
 * @returns {Promise<[*, undefined] | [undefined, *]>}
 */
export function ofAnyCase<
  GAnyResult extends unknown,
  GAnyDefault extends unknown,
  GFunction extends (...args: unknown[]) => GAnyResult,
  GPromise extends Promise<GAnyResult>,
  GAsyncFunction extends (...args: unknown[]) => GPromise,
  GCallable extends GFunction | GPromise | GAsyncFunction | IGenerator,
  GOptions extends IConfig<GAnyDefault>,
>(
  callable: GCallable,
  config?: GOptions,
): Promise<[GAnyResult | GAnyDefault, TErrorOrVoid]> {
  let theConfig: IConfig<GAnyDefault> = {};
  const { args, defaults, error, timeout } = new Object(config) as GOptions;
  Object.assign(theConfig, { args, defaults, error, timeout });
  let call;
  switch (
    callable.constructor.name ||
    Object.prototype.toString.call(callable)
  ) {
    case PROMISE:
      call = callable;
      theConfig.retries = 0;
      delete theConfig.args;
      break;
    case FUNCTION_ASYNC:
      call = (callable as GAsyncFunction)(
        ...(Array.isArray(theConfig.args) ? [...theConfig.args] : []),
      );
      break;
    case FUNCTION:
      call = new Promise((resolve, reject) => {
        try {
          resolve(
            (callable as GFunction)(
              ...(Array.isArray(theConfig.args) ? [...theConfig.args] : []),
            ),
          );
        } catch (caughtFunctionError) {
          reject(caughtFunctionError);
        }
      });
      break;
    case FUNCTION_GENERATOR:
      call = new Promise((resolve, reject) => {
        const gen = (callable as GFunction)(
          ...(Array.isArray(theConfig.args) ? [...theConfig.args] : []),
        );
        try {
          resolve((gen as IGenerator).next().value);
        } catch (caughtGeneratorFunctionError) {
          reject(caughtGeneratorFunctionError);
        }
      });
      break;
    case OBJECT_GENERATOR:
      call = new Promise((resolve, reject) => {
        try {
          resolve((callable as IGenerator).next().value);
        } catch (caughtGeneratorError) {
          reject(caughtGeneratorError);
        }
      });
      delete theConfig.args;
      break;
    default:
      call = new Promise((resolve, reject) => {
        Promise.resolve(callable as GPromise)
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
    } else {
      delete theConfig.timeout;
    }
  } else {
    delete theConfig.timeout;
  }
  // noinspection DuplicatedCode
  return (
    (theConfig.timeout
      ? Promise.race([
        Promise.resolve(call),
        new Promise((_resolve, reject) => {
          setTimeout(() =>
            reject(new Error(`Timeout: ${theConfig.timeout}ms`))
          );
        }),
      ])
      : Promise.resolve(call))
      .then<[GAnyResult, undefined]>((result) => {
        return [result, undefined] as [GAnyResult, undefined];
      })
      // @ts-ignore
      .catch<[GAnyDefault, Error]>((reason: any) => {
        if (theConfig.retries !== undefined) {
          const retries = Number.parseInt(`${theConfig.retries}`, 10);
          if (Number.isFinite(retries) && retries > 0) {
            theConfig.retries = retries > Number.MAX_SAFE_INTEGER
              ? Number.MAX_SAFE_INTEGER
              : retries;
          } else {
            delete theConfig.retries;
          }
        } else {
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
          reason = new Error(reasonToMessage(reason));
        }
        if ("error" in theConfig && theConfig.error instanceof Error) {
          reason = theConfig.error;
        } else if (typeof theConfig.error === "string") {
          reason.message = theConfig.error;
        }
        return [theConfig.defaults, reason] as [GAnyDefault, Error];
      })
  );
}
