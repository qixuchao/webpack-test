interface ITest<T> {
    name: T extends string ? string : any,
    [propsName: string]: any
}

type IString = ITest<'1'>
