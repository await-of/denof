/**
 * @name ofResult
 * @param {Promise} promise
 * @param {*=} defaultResult
 * @returns {Promise<*>}
 */
export function ofResult<
  GAnyDefault extends unknown,
  GAnyResult extends unknown,
  GPromise extends Promise<GAnyResult>,
>(
  promise: GPromise,
  defaultResult?: GAnyDefault,
): Promise<GAnyResult | GAnyDefault> {
  return Promise
    .resolve<GAnyResult>(promise)
    .then<GAnyResult>((result) => {
      return result;
    })
    .catch<GAnyDefault>(() => {
      return defaultResult as GAnyDefault;
    });
}
