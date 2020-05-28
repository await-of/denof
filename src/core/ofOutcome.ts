import { IConfig } from "../interface/config.ts";
import { IGenerator } from "../interface/generator.ts";

import { TErrorOrVoid } from "../type/errorOrVoid.ts";

import { ofAnyCase } from "./ofAnyCase.ts";

/**
 * @name ofOutcome
 * @description Returns result or thrown error wherever happens
 * @param {Function|Promise} callable
 * @param {*=} config
 * @returns {Promise<*>}
 */
export function ofOutcome<
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
): Promise<GAnyResult | GAnyDefault | TErrorOrVoid> {
  return new Promise((resolve) => {
    return ofAnyCase(callable, config).then(([result, error]) => {
      if (error) {
        resolve(error);
      } else {
        resolve(result as GAnyResult);
      }
    });
  });
}
