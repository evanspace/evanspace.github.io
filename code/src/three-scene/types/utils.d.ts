// 深度可选
export declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends Object
    ? DeepPartial<T[P]>
    : T[P]
}
