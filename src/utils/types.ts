type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

export type WritableKeysOf<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>;
}[keyof T];

export type WritableProps<T> = Pick<T, WritableKeysOf<T>>;

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type PublicInterface<T> = { [K in keyof T]: T[K] };
export type NonFunctionPublicInterface<T> = Pick<PublicInterface<T>, NonFunctionPropertyNames<T>>;

export type PublicInterfaceRecurse<T> = {
  [K in keyof T]: T[K] extends Object ? PublicInterfaceRecurse<T[K]> : T[K];
};

export type NonFunctionPublicInterfaceRecurse<T> = Pick<
  {
    [K in keyof T]: T[K] extends object
      ? T[K] extends Function
        ? T[K]
        : NonFunctionPublicInterfaceRecurse<T[K]>
      : T[K];
  },
  NonFunctionPropertyNames<T>
>;

export type KeysMatching<T, V> = NonNullable<
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
