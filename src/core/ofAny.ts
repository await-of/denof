import { IGenerator } from "../interface/generator.ts";

import { TErrorOrString } from "../type/errorOrString.ts";
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
 * @name ofAny
 * @param {Function|Promise} callable
 * @param {[]=} args
 * @param {*=} defaultResult
 * @param {*=} overrideError
 * @returns {Promise<[*, undefined] | [undefined, *]>}
 */
export function ofAny<
  GAnyResult extends unknown,
  GAnyDefault extends unknown,
  GFunction extends (...args: unknown[]) => GAnyResult,
  GPromise extends Promise<GAnyResult>,
  GAsyncFunction extends (...args: unknown[]) => GPromise,
  GCallable extends GFunction | GPromise | GAsyncFunction | IGenerator,
>(
  callable: GCallable,
  args?: any[],
  defaultResult?: GAnyDefault,
  overrideError?: TErrorOrString,
): Promise<[GAnyResult | GAnyDefault, TErrorOrVoid]> {
  let call;
  switch (
    callable.constructor.name || Object.prototype.toString.call(callable)
  ) {
    case PROMISE:
      call = (callable as GPromise);
      break;
    case FUNCTION_ASYNC:
      call = (callable as GAsyncFunction)(
        ...(Array.isArray(args) ? [...args] : []),
      );
      break;
    case FUNCTION:
      call = new Promise((resolve, reject) => {
        try {
          resolve(
            (callable as GFunction)(...(Array.isArray(args) ? [...args] : [])),
          );
        } catch (caughtFunctionError) {
          reject(caughtFunctionError);
        }
      });
      break;
    case FUNCTION_GENERATOR:
      call = new Promise((resolve, reject) => {
        const gen = (callable as GFunction)(
          ...(Array.isArray(args) ? [...args] : []),
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
      break;
    default:
      call = new Promise((resolve, reject) => {
        Promise
          .resolve(callable as GPromise)
          .then(resolve)
          .catch(reject);
      });
  }
  return Promise
    .resolve<GAnyResult>(call as GPromise)
    .then<[GAnyResult, undefined]>((result) => {
      return [result, undefined] as [GAnyResult, undefined];
    })
    .catch<[GAnyDefault, Error]>((reason: any) => {
      if (!(reason instanceof Error)) {
        reason = new Error(reasonToMessage(reason));
      }
      if (overrideError instanceof Error) {
        reason = overrideError;
      } else if (typeof overrideError === "string") {
        reason.message = overrideError;
      }
      return [
        defaultResult,
        reason,
      ] as [GAnyDefault, Error];
    });
}
