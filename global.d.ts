export type Nullable<T> = {
    [P in keyof T]: Nullable<T[P]> | null
}

export type DeepNullable<T> = Nullable<{ [P in keyof T]: DeepNullable<T[P]> }>

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
          ? RecursivePartial<T[P]>
          : T[P]
}
