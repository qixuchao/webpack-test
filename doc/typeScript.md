## Typescript
[ts高级语法](https://mp.weixin.qq.com/s/KyT3wXXTBVbxaM445ZHaeg)  
### ts存在的价值和意义
因为js弱类型语言本身是没有变量类型的约束，无法在编译阶段做到类型检查，提早发现错误。所以就出现了ts,在开发阶段就给出相关的错误信息。
#### type interface
type 是interface的别名

#### 泛型
在定义函数、接口或者类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性  
和any不同，any是指任意类型，对传入的类型不做判断，就有约束性是不安全的，

```typescript
    type Partial<T> = {
        [P in keyof T]?: T[P] extends object ? Partial<object> : T[P]
    }
    
    enum Methods {
        get = 'get'
    }
```
#### 如何绕过额外参数的类型校验
1. 类型兼容
   通过赋值操作，不要将参数值直接传递，现将参数值赋值给变量，再将变量传给参数
```typescript
    // 1、
    interface IProps {
        name: string
    }
    const printLabel = (labelObject: IProps) => {
        console.log(labelObject.name)
    }
    const myObj = {
        name: 'janne',
        age: 23
    }
    printLabel(myObj) // 将要传入的参数先用一个变量接收，再将引用传入到参数中，这样就可以绕过额外参数的校验
```
**为什么赋值就使得类型检测变得宽松了**
> 　　TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做鸭式辨型法或结构性子类型化。  

拿上面的例子来说，赋值操作`const myObj = { name: 'janne', age: 23 }`根据类型推论实际的产生的效果是`const myObj: { name: string, age: number } = { name: 'janne', age: 23}`
然后将myObj以参数的形式传给

2. 类型断言

3. 索引签名


### 常用api
1. 索引类型查询操作符 `keyof`  
   `keyof T` 返回T上所有公共属性名的联合
```typescript
  const obj = { a: '1',b: 2 };
  type Foo = typeof obj; // { a: string, b: number }
  type B = keyof obj; // 'a' | 'b'
```
2. extends 接口继承，可以多继承，子接口就拥有了父接口的属性   
** 注意事项  
   如果多继承中父接口中存在类型不同但是属性名相同时，不会像其他语言那样进行合并，而是直接提示错误
```typescript
  interface Shape {
    color: string;
  }
  interface PenStroke {
    penWidth: number;
  } 
  interface Square extends Shape, PenStroke {
    sideLength: number;
  }
```
类型约束 `T extends U`
>  这里的extends不是类、接口的继承，而是对于类型的判断和约束，意思是判断T能否赋值(判断T的类型是否包含在U中)给U  
```typescript
// 判断T是否可以赋值给U,如果可以则返回T否则返回U
type excludes <T, U> = T extends U ? T : never
```
3. 原始类型保护 `typeof`
    语法： `typeof v === 'typename'` 或 `typeof v !== 'typename'`
    > 用来判断数据的类型是否是某个原始类型（number、string、boolean、symbol）并进行类型保护
   
    > 'typename'必须是number、string、boolean、symbol，但是TS不会阻止你跟其他字符串做比较。
    
    > 使用 `typeof` 进行类型判断后，TS会将变量缩减为那个具体的类型(可以直接使用这个类型的api)，只要这个类型和变量的原始类型时兼容的。
```typescript
function print(value: number | string) {
    if (typeof value === 'string') {
        console.log(value.split('').join(', '))
    } else {
        console.log(value.toFixed(2))
    }
}
```
4. any和unknown的区别
   unknown 是 top type (任何类型都是它的 subtype) , 而 any 既是 top type, 又是 bottom type (它是任何类型的 subtype ) , 这导致 any 基本上就是放弃了任何类型检查。
简单说就是any的类型可以赋值给任意类型，任意类型也可以赋值给any,但是任意类型能赋值给unknown但是unknown只能赋值给any
5. never 表示的是那些永不存在的值的类型  
   值永不存在的两种情况
   + 如果一个函数在执行时报错了，函数无法执行到返回值的那一步了，及具有不可到达的终点，永远不会有返回值
   + 函数中执行无限循环的代码，使得程序无法执行到返回执行的那一步  
** never与null,undefined一样是任何类型的子类型，也可以赋值给任意类型,但除了never没有类型可以赋值给never,any也不可以。  
** never与其他类型联合后就没有never了
6. 类型断言
   在类型转换时预先知道值的具体类型
```typescript
    let someValue: any = "this is a string"
    // 尖括号得语法
    // let stringLength: number = (<string>someValue).length
    // as的语法
    // let stringLength: number = (someValue as string).length
```
8. 类型推论
  如果没有明确指定类型，那么`ts`会依据类型推论的规则推断出一个类型
```typescript
    let a = 'string'
    a = 7 // Error,a是一个string的类型
    
    let b; // 没有初始值时默认类型时any
    b = 'string'
    b = 2
```
9. 联合类型 `(T | U)`  
    取值可以时多个类型中的一种，多个类型通过`|`分割
10. 交叉类型 `(T & U)`  
    将多个类型合并成一个类型
11. 类型映射 `(in)`  
    会遍历指定接口的key或者是遍历联合类型  
```typescript
interface Person {
    name: string
    age: number
    gender: number
}
// 将 T 的所有属性转换为只读类型
type ReadOnlyType<T> = {
    readonly [P in keyof T]: T
}
```  
12. 类型谓词 `is`  
    parameterName is Type  
    >  parameterName必须是来自于当前函数签名里的一个参数名，判断parameterName是否是Type类型
13. 待推断类型 `infer`
    可以使用 `infer P` 来标记一个泛型，表示这个泛型是一个待推断的类型，并且可以直接使用，只能出现在extends的子语句中。
```typescript
type ParamType<T> = T extends (param: infer P) => any ? P : T; // P是param的类型，是未知的但是可以直接使用

type FunctionType = (value: number) => boolean

type Param = ParamType<FunctionType>;   // type Param = number

type OtherParam = ParamType<symbol>;   // type Param = symbol
```
14. 枚举类型 `Enum`
    > 枚举是一个被命名的整型常数的集合，枚举在日常生活中很常见。它是一种数据结构，使用枚举我们可以定义一些带名字的常量，清晰的表达意图或者创建一组有区别的用例。
    TS支持数字和基于字符串的枚举。
```typescript
enum Days { Sun,Mon,Tue,Web,Thu,Fri,Sat };
// 枚举属性没有赋值，值是从0往上递增,
```

#### 常见的操作符
1. `?`
2. `-？`

#### TS内置的对象
+ `ECMAScript`的内置对象  
    `String`、`Number`、`Boolean`、`Error`、`Date`、`RegExp`.
+ `BOM`和`DOM`的内置对象  
    `Document`、`HTMLElement`、`Event`、`NodeList`.
+ 类数组对象 `IArguments`  
```typescript
interface IArguments {
    [index: number]: any,
    length: number,
    callee: Function
}

function fn () {
    const args: IArguments = arguments;
}
```

?
-?
+?
void


#### 重载
在进行赋值时，可以将参数参数少的赋值给参数多的，反之就不行。
示例: 约束一个函数的两个参数a,b都支持string和




1、Partial
让接口返回可选类型



类型定义

type Partial<T> = {
[P in keyof T]?: T[P];
};


interface Person {
name: string;
age: number;
}

// error , property age is missing.
const axes: Person = {
name: 'axes'
}

type NewPerson = Partial<Person>;

// correct, because age can be undefined.
const axes: NewPerson = {
name: 'axes'
}

// 等同于

interface Person {
name?: string;
age?: number;
}

不过Partial只支持一层结构



export type PowerPartial<T> = {
// 如果是 object，则递归类型
[U in keyof T]?: T[U] extends object
? PowerPartial<T[U]>
: T[U]
};


3、Pick
从 T 中，选择一组键在并集 K 中的属性。实际就是说在原有的类型 T 上 筛选出想要的全部或极个别的属性和类型

类型定义

/**
* From T, pick a set of properties whose keys are in the union K
  */
  type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
  };


interface B {
id: number;
name: string;
age: number;
}

type PickB = Pick<B, "id" | "name">;





4、Record
构造一个具有一组重复属性 K(类型 T)的类型。



类型定义

/**
* Construct a type with a set of properties K of type T
  */
  type Record<K extends keyof any, T> = {
  [P in K]: T;
  };


import { IncomingMessage, ServerResponse } from "http";

enum Methods {
GET = "get",
POST = "post",
DELETE = "delete",
PUT = "put",
}

type IRouter = Record<Methods, (req: IncomingMessage, res: ServerResponse) => void>;

// 相当于
{ [T in keyof Methods]: string; }



5、ReturnType
// node_modules/typescript/lib/lib.es5.d.ts

type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
这个类型也非常好用，可以获取方法的返回类型，可能有些人看到这一长串就被绕晕了，但其实也是使用了 Conditional Types ，推论 ( infer ) 泛型 T 的返回类型 R 来拿到方法的返回类型。

实际使用的话，就可以通过 ReturnType 拿到方法的返回类型，如下的示例

function TestFn() {
return '123123';
}

type T01 = ReturnType<typeof TestFn>; // string


6、Exclude
排除指定范围的类型



类型实现

// node_modules/typescript/lib/lib.es5.d.ts

type Exclude<T, U> = T extends U ? never : T;



这个类型可以将 T 中的某些属于 U 的类型移除掉，举个例子

type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"



Omit<T, K extends keyof any>

从泛型 T 中提取出不在泛型 K 中的属性类型，并组成一个新的对象类型


类型实现

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;



type T00 = Omit<{a:string;b:number;c:string}, "a" | "c" | "f">;  // {b:number}



7、Extract
用于从类型T中取出可分配给U类型的成员，说白了就是取交集。而我们往往将交叉类型理解成交集。这是错误的



type Extract<T, U> = T extends U ? T : never;


8、ThisType
// node_modules/typescript/lib/lib.es5.d.ts

interface ThisType<T> { }
可以看到声明中只有一个接口，没有任何的实现，说明这个类型是在 ts 源码层面支持的，而不是通过类型变换，那这个类型有啥用呢，是用于指定上下文对象类型的。



interface Person {
name: string;
age: number;
}

const obj: ThisType<Person> = {
dosth() {
this.name // string
}
}

// 等同于
const obj = {
dosth(this: Person) {
this.name // string
}
}


9、类型推导
说到类型推导，我们先讲讲extends关键字，extends 运用在 type 和 class 中时完全是两种作用的效果。

在class中用于继承
在type中用于类型判断，一种条件表达式进行类型的关系检测。
type Equal<X, Y> = X extends Y ? true : false;

type Num = Equal<1, 1>; // true
type Str = Equal<'a', 'a'>; // true
type Boo = Equal<true, false>; // false
可以简单理解为一个三元表达。



这里提另外的关键字infer，表示在 extends 条件语句中待推断的类型变量。

type ParamType<T> = T extends (param: infer P) => any ? P : T;
在这个条件语句 T extends (param: infer P) => any ? P : T 中，infer P 表示待推断的函数参数。

整句表示为：如果 T 能赋值给 (param: infer P) => any，则结果是 (param: infer P) => any 类型中的参数 P，否则返回为 T。

type ParamType<T> = T extends (param: infer P) => any ? P : T;

function func1(param:ParamType<{}>){
//   param typeof {}
}

function func2(param:ParamType<(str:string)=>void>){
//   param typeof string
}
ReturnType 就是基于infer实现，infer除了在参数中出现也能在返回值出现。

type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;


高级用法：

tuple 转 union ，如：[string, number] -> string | number

解答之前，我们需要了解 tuple 类型在一定条件下，是可以赋值给数组类型：

type TTuple = [string, number];
type TArray = Array<string | number>;

type Res = TTuple extends TArray ? true : false;    // true
type ResO = TArray extends TTuple ? true : false;   // false
因此，在配合 infer 时，这很容做到：

type ElementOf<T> = T extends Array<infer E> ? E : never

type TTuple = [string, number];

type ToUnion = ElementOf<ATuple>; // string | number
在 stackoverflow 上看到另一种解法，比较简（牛）单（逼）：

type TTuple = [string, number];
type Res = TTuple[number];  // string | number
type Res = TTuple[0];  // string
type Res = TTuple[1];  // number
type TMap = {a:string;b:number}
type TKeyOf = a | b;
type Res1 = TMap[keyof TMap]; // string | number
typeof a | typeof b // string | number


扩展阅读：
extends
keyof
in
infer
&
|
?
-?
+?
never
unkown
any
readonly
void


练习
interface Logger {
time: number;
asyncLog:(msg: string) => Promise<string>
syncLog:(msg: string) => number;
}

type Translate<T> = /** 你需要实现的部分 **/;

// 要求 Translate
//  1. 提取出为函数类型的属性，丢弃掉其它类型的属性
//  2. 将函数返回类型调整为形参类型(假定有且只有一个参数)

// 实现效果如下:
type T0 = Translate<Logger>;

// 等价于
type T0 = {
// 其它属性被丢弃
asyncLog: (arg: string) => string; // return 类型被调整为跟 arg 保持一致
syncLog: (arg: string) => string; // return 类型被调整为跟 arg 保持一致
}


type NonFunctionKeys<T> = {
[K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];

type Translate<T extends object> = {
[K in Exclude<keyof T, NoFunctionKeys1<T>>]: T[K] extends (
arg: infer P,
) => any
? (arg: P) => P
: never;
};




参考资料：
https://github.com/piotrwitek/utility-types

https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

