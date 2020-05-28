import { TErrorOrString } from "../type/errorOrString.ts";
import { TErrorOrVoid } from "../type/errorOrVoid.ts";

import { reasonToMessage } from "../util/reasonToMessage.ts";

/**
 * @name ofIt
 * @param {Promise} promise
 * @param {*=} defaultResult
 * @param {*=} overrideError
 * @returns {Promise<[*, undefined] | [undefined, *]>}
 */
export function ofIt<
  GAnyDefault extends unknown,
  GAnyResult extends unknown,
  GPromise extends Promise<GAnyResult>,
>(
  promise: GPromise,
  defaultResult?: GAnyDefault,
  overrideError?: TErrorOrString,
): Promise<[GAnyResult | GAnyDefault, TErrorOrVoid]> {
  return Promise
    .resolve<GAnyResult>(promise)
    .then<[GAnyResult, undefined]>((result) => {
      return [
        result,
        undefined,
      ];
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
