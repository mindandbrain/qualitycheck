export type TypedCallback<T> = (v: T) => void;
export type StringCallback = TypedCallback<string>;
export type BooleanCallback = TypedCallback<boolean>;
export type NumberCallback = TypedCallback<number>;
