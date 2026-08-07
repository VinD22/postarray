import type { Services as ApplicationServices } from '@relay/application';

import type { Services as ApiServices } from '../application/port';

type MethodNames<Value> = {
  [Key in keyof Value]: Value[Key] extends (...args: infer _Arguments) => unknown ? Key : never;
}[keyof Value];

type MissingMethods = {
  [Service in keyof ApiServices]: Service extends keyof ApplicationServices
    ? Exclude<
        MethodNames<ApiServices[Service]>,
        MethodNames<ApplicationServices[Service]>
      > extends never
      ? never
      : `${Service & string}.${Exclude<
          MethodNames<ApiServices[Service]>,
          MethodNames<ApplicationServices[Service]>
        > &
          string}`
    : `${Service & string}.*`;
}[keyof ApiServices];

type AssertNever<Value extends never> = Value;

/** Build fails with the missing `service.method` when the API drifts again. */
export type ApiServiceContractCheck = AssertNever<MissingMethods>;
