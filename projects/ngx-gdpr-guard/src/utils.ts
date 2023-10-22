export type MethodNames<T extends object> = keyof {
  [K in keyof T]: T extends (...args: unknown[]) => unknown ? T[K] : never;
};
