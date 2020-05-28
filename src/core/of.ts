import { reasonToMessage } from "../util/reasonToMessage.ts";

/**
 * @name of
 * @param {Promise} promise
 * @returns {Promise<[*, undefined] | [undefined, *]>}
 */
export function of<
  GAnyResult extends unknown,
  GPromise extends Promise<GAnyResult>,
>(
  promise: GPromise,
): Promise<[GAnyResult | undefined, Error | undefined]> {
  return Promise
    .resolve<GAnyResult>(promise)
    .then<[GAnyResult, undefined]>((result) => {
      return [
        result,
        undefined,
      ];
    })
    .catch<[undefined, Error]>((reason: any) => {
      if (!(reason instanceof Error)) {
        reason = new Error(reasonToMessage(reason));
      }
      return [
        undefined,
        reason,
      ];
    });
}
