export interface IConfig<GAnyDefault extends unknown> {
  args?: any[];
  /**
   * @ignore
   */
  attempt?: number;
  defaults?: GAnyDefault;
  error?: string | Error;
  retries?: number;
  timeout?: number;
}
