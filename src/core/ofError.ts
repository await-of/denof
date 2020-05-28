import { TErrorOrString } from "../type/errorOrString.ts";
import { TErrorOrVoid } from "../type/errorOrVoid.ts";

import { reasonToMessage } from "../util/reasonToMessage.ts";

/**
 * @name ofError
 * @param {Promise} promise
 * @param {*=} overrideError
 * @returns {Promise<*>}
 */
export function ofError<
  GAnyResult extends unknown,
  GPromise extends Promise<GAnyResult>,
>(
  promise: GPromise,
  overrideError?: TErrorOrString,
): Promise<TErrorOrVoid> {
  return Promise
    .resolve<GAnyResult>(promise)
    .then<undefined>(() => {
      return undefined;
    })
    .catch<Error>((reason: any) => {
      if (!(reason instanceof Error)) {
        reason = new Error(reasonToMessage(reason));
      }
      if (overrideError instanceof Error) {
        reason = overrideError;
      } else if (typeof overrideError === "string") {
        reason.message = overrideError;
      }
      return reason;
    });
}
