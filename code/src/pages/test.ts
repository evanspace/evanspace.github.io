
// type Watcher<T> = {
//   // on (
//   on<K extends keyof T & string> (
//     // eventName: `${ string }change`,
//     // eventName: `${ 'firstName' | 'lastName' | 'age' }change`,
//     // eventName: `${ string & keyof T }change`,
//     eventName: `${ K }change`,
//     callback: ( newVal: T[ K ], oldVal: T[ K ] ) => void
//   ): void
// }

// declare function watch<T>( obj: T ): Watcher<T>

// const personWatcher = watch( {
//   firstName: 'Evan',
//   lastName: 'You',
//   age: 28,
//   six: 'a'
// } )

// personWatcher.on(
//   'agechange',
//   ( newVal, oldVal ) => {
//     console.log( newVal, oldVal )
//   }
// )


interface ComplexObject {
  mandatory: string
  optioon1?: string
  option2?: string
}

// 获取所有可选字段
type GetOptional<T> = {
  // [ K in keyof T  ]: T[ K ]
  // [ K in keyof T as `get${ Capitalize<K & string> }` ]: T[ K ]
  [ K in keyof T as T[ K ] extends Required<T>[ K ] ? never : K ]: T[ K ]
}

let keys: GetOptional<ComplexObject>
